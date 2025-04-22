import { DelegatingHandler } from "../../Common/Http/DelegatingHandler.js";
import { Semaphore } from "../../Common/Threading/Semaphore.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { ValueOutOfRangeError } from "../../Common/ValueOutOfRangeError.js";
import { HttpMethod } from "../../Common/Http/HttpMethod.js";
import { HttpMessageHandler } from "../../Common/Http/HttpMessageHandler.js";
import { HttpRequestMessage } from "../../Common/Http/HttpRequestMessage.js";
import { EventEmitter } from "../../Common/Threading/EventEmitter.js";
import { Delay } from "../../Common/Threading/Delay.js";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode.js";
import { ObjectDisposedError } from "../../Common/ObjectDisposedError.js";
import { Func } from "../../Common/Func.js";
import { CancellationToken } from "../../Common/Threading/CancellationToken.js";
import { OperationCanceledError } from "../../Common/Threading/OperationCanceledError.js";

/**
 * A {@link DelegatingHandler} that implements a per route rate-limiting mechanism for Aula servers.
 * */
export class AulaRouteRateLimiterHandler extends DelegatingHandler
{
	readonly #_eventEmitter: EventEmitter<AulaRouteRateLimiterHandlerEvents> = new EventEmitter();
	readonly #_allowConcurrentRequests: boolean;
	readonly #_routeSemaphores: Map<string, Semaphore> = new Map();
	readonly #_rateLimits: Map<string, RouteRateLimit> = new Map();
	#_disposed: boolean = false;

	public constructor(innerHandler: HttpMessageHandler, disposeInnerHandler: boolean, allowConcurrentRequests: boolean)
	{
		super(innerHandler, disposeInnerHandler);
		SealedClassError.throwIfNotEqual(AulaRouteRateLimiterHandler, new.target);
		ThrowHelper.TypeError.throwIfNotType(allowConcurrentRequests, "boolean");

		this.#_allowConcurrentRequests = allowConcurrentRequests;
	}

	/**
	 * Gets whether the handler allows sending multiple requests concurrently to the same route.
	 * */
	public get allowConcurrentRequests()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return this.#_allowConcurrentRequests;
	}

	/**
	 * Send an HTTP request as an asynchronous operation.
	 * @returns The promise object representing the asynchronous operation.
	 * @throws {TypeError} If the {@link HttpRequestMessage.requestUri} of {@link message} is not a {@link URL}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @remarks The returned {@link Promise} will complete once the response has been received.
	 * */
	public async send(message: HttpRequestMessage, cancellationToken: CancellationToken)
	{
		ThrowHelper.TypeError.throwIfNotType(message, HttpRequestMessage);
		ThrowHelper.TypeError.throwIfNotType(message.requestUri, URL);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);

		const routeHash = this.#hashRoute(message.method, message.requestUri);

		let routeSemaphore = this.#_routeSemaphores.get(routeHash);
		if (!this.#_allowConcurrentRequests && routeSemaphore === undefined)
		{
			routeSemaphore = new Semaphore(1, 1);
			this.#_routeSemaphores.set(routeHash, routeSemaphore);
		}

		if (routeSemaphore !== undefined)
		{
			try
			{
				await routeSemaphore.waitOne(cancellationToken);
			}
			catch (error)
			{
				if (error instanceof OperationCanceledError)
				{
					routeSemaphore.release();
				}

				throw error;
			}
		}

		while (true)
		{
			ObjectDisposedError.throwIf(this.#_disposed);

			const now = Date.now();

			let routeRateLimit = this.#_rateLimits.get(routeHash);
			if (routeRateLimit !== undefined &&
			    routeRateLimit.resetTimestamp < now)
			{
				routeRateLimit = new RouteRateLimit(
					routeRateLimit.requestLimit,
					routeRateLimit.windowMilliseconds,
					routeRateLimit.requestLimit,
					routeRateLimit.windowMilliseconds + now);
				this.#_rateLimits.set(routeHash, routeRateLimit);
			}

			// When concurrent requests are allowed, the response headers may not be reliable;
			// therefore, we proactively track the rate limit and take action when approaching it.
			if (routeRateLimit !== undefined &&
			    routeRateLimit.remainingRequests < 1)
			{
				const eventEmission = this.#_eventEmitter.emit(
					"RequestDeferred", new RequestDeferredEvent(message.requestUri, routeRateLimit.resetTimestamp));
				const delay = Delay(now - routeRateLimit.resetTimestamp);
				await Promise.all([ eventEmission, delay ]);
				continue;
			}

			const response = await super.send(message, cancellationToken);

			const requestLimitHeaderValues = response.headers.get("X-RateLimit-Route-Limit");
			const windowMillisecondsHeaderValues = response.headers.get("X-RateLimit-Route-WindowMilliseconds");
			if (requestLimitHeaderValues === undefined ||
			    windowMillisecondsHeaderValues === undefined)
			{
				// Endpoint does not have rate limits.
				routeSemaphore?.release();
				return response;
			}

			const requestLimit = parseInt(requestLimitHeaderValues[0], 10);
			const windowMilliseconds = parseInt(windowMillisecondsHeaderValues[0], 10);
			if (routeRateLimit === undefined ||
			    (routeRateLimit.requestLimit !== requestLimit ||
			    routeRateLimit.windowMilliseconds !== windowMilliseconds))
			{
				// This is the first request, so the limits need to be synchronized,
				// or the global rate limits may have been updated on the server
				routeRateLimit = new RouteRateLimit(
					requestLimit,
					windowMilliseconds,
					requestLimit,
					windowMilliseconds + now);
				this.#_rateLimits.set(routeHash, routeRateLimit);
			}

			routeRateLimit = new RouteRateLimit(
				routeRateLimit.requestLimit,
				routeRateLimit.windowMilliseconds,
				routeRateLimit.remainingRequests - 1,
				routeRateLimit.resetTimestamp);
			this.#_rateLimits.set(routeHash, routeRateLimit);

			const isGlobalHeaderValues = response.headers.get("X-RateLimit-IsGlobal");
			const resetTimestampHeaderValues = response.headers.get("X-RateLimit-ResetsAt");
			if (isGlobalHeaderValues !== undefined &&
			    isGlobalHeaderValues[0] === "false" &&
			    resetTimestampHeaderValues !== undefined)
			{
				// No requests remain, or an unexpected HTTP 429 (Too Many Requests) status code was encountered.
				const resetTimestamp = Date.parse(resetTimestampHeaderValues[0]);

				if (response.statusCode === HttpStatusCode.TooManyRequests)
				{
					const eventEmission = await this.#_eventEmitter.emit("RateLimited", new RouteRateLimitedEvent(resetTimestamp));
					const delay = await Delay(now - resetTimestamp);
					await Promise.all([ eventEmission, delay ]);
					continue;
				}

				await this.#_eventEmitter.emit("RequestDeferred", new RequestDeferredEvent(message.requestUri, resetTimestamp));
			}

			routeSemaphore?.release();
			return response;
		}
	}

	/**
	 * Registers a listener for a specific event.
	 * @param event The name of the event to subscribe to.
	 * @param listener The callback function to invoke when the event occurs.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 */
	public on<TEvent extends keyof AulaRouteRateLimiterHandlerEvents>(
		event: TEvent,
		listener: AulaRouteRateLimiterHandlerEvents[TEvent])
	{
		ThrowHelper.TypeError.throwIfNullable(event);
		ThrowHelper.TypeError.throwIfNotType(listener, "function");
		ObjectDisposedError.throwIf(this.#_disposed);

		return this.#_eventEmitter.on(event, listener);
	}

	/**
	 * Removes an already registered listener.
	 * @param event The name of the event that the listener is listening to.
	 * @param listener The callback function of the listener.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 */
	public remove<TEvent extends keyof AulaRouteRateLimiterHandlerEvents>(
		event: TEvent,
		listener: AulaRouteRateLimiterHandlerEvents[TEvent])
	{
		ThrowHelper.TypeError.throwIfNullable(event);
		ThrowHelper.TypeError.throwIfNotType(listener, "function");
		ObjectDisposedError.throwIf(this.#_disposed);

		return this.#_eventEmitter.remove(event, listener);
	}

	public async [Symbol.asyncDispose]()
	{
		await super[Symbol.asyncDispose]();

		if (this.#_disposed)
		{
			return;
		}

		this.#_eventEmitter[Symbol.dispose]();
		this.#_rateLimits.clear();

		for (const semaphore of this.#_routeSemaphores)
		{
			semaphore[1][Symbol.dispose]();
		}

		this.#_routeSemaphores.clear();

		this.#_disposed = true;
	}

	#hashRoute(httpMethod: HttpMethod, uri: URL)
	{
		ThrowHelper.TypeError.throwIfNotType(httpMethod, HttpMethod);
		ThrowHelper.TypeError.throwIfNotType(uri, URL);

		return `${httpMethod}.${uri}`;
	}
}

class RouteRateLimit
{
	readonly #requestLimit: number;
	readonly #windowMilliseconds: number;
	readonly #remainingRequests: number;
	readonly #resetTimestamp: number;

	public constructor(
		requestLimit: number,
		windowMilliseconds: number,
		remainingRequests: number,
		resetTimestamp: number)
	{
		SealedClassError.throwIfNotEqual(RouteRateLimit, new.target);
		ThrowHelper.TypeError.throwIfNotType(requestLimit, "number");
		ThrowHelper.TypeError.throwIfNotType(windowMilliseconds, "number");
		ThrowHelper.TypeError.throwIfNotType(remainingRequests, "number");
		ThrowHelper.TypeError.throwIfNotType(resetTimestamp, "number");
		ValueOutOfRangeError.throwIfLessThan(requestLimit, 1);
		ValueOutOfRangeError.throwIfLessThan(remainingRequests, 0);
		ValueOutOfRangeError.throwIfLessThan(windowMilliseconds, 1);
		ValueOutOfRangeError.throwIfGreaterThan(remainingRequests, requestLimit);

		this.#requestLimit = requestLimit;
		this.#windowMilliseconds = windowMilliseconds;
		this.#remainingRequests = remainingRequests;
		this.#resetTimestamp = resetTimestamp;
	}

	public get requestLimit()
	{
		return this.#requestLimit;
	}

	public get windowMilliseconds()
	{
		return this.#windowMilliseconds;
	}

	public get remainingRequests()
	{
		return this.#remainingRequests;
	}

	public get resetTimestamp()
	{
		return this.#resetTimestamp;
	}
}

export interface AulaRouteRateLimiterHandlerEvents
{
	RequestDeferred: Func<[ RequestDeferredEvent ]>;
	RateLimited: Func<[ RouteRateLimitedEvent ]>;
}

export class RequestDeferredEvent
{
	readonly #uri: URL;
	readonly #_resetTimestamp: number;
	#_resetDate: Date | null = null;

	public constructor(uri: URL, resetTimestamp: number)
	{
		SealedClassError.throwIfNotEqual(RequestDeferredEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(uri, URL);
		ThrowHelper.TypeError.throwIfNotType(resetTimestamp, "number");

		this.#uri = uri;
		this.#_resetTimestamp = resetTimestamp;
	}

	public get uri()
	{
		return this.#uri;
	}

	public get resetDate()
	{
		return this.#_resetDate ??= new Date(this.#_resetTimestamp);
	}
}

export class RouteRateLimitedEvent
{
	readonly #_resetTimestamp: number;
	#_resetDate: Date | null = null;

	public constructor(resetTimestamp: number)
	{
		SealedClassError.throwIfNotEqual(RouteRateLimitedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(resetTimestamp, "number");

		this.#_resetTimestamp = resetTimestamp;
	}

	public get resetDate()
	{
		return this.#_resetDate ??= new Date(this.#_resetTimestamp);
	}
}

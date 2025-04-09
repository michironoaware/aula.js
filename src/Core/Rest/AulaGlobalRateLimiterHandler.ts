import { DelegatingHandler } from "../../Common/Http/DelegatingHandler.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { EventEmitter } from "../../Common/Threading/EventEmitter.js";
import { HttpRequestMessage } from "../../Common/Http/HttpRequestMessage.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { HttpMessageHandler } from "../../Common/Http/HttpMessageHandler.js";
import { AutoResetEvent } from "../../Common/Threading/AutoResetEvent.js";
import { ValueOutOfRangeError } from "../../Common/ValueOutOfRangeError.js";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode.js";
import { ObjectDisposedError } from "../../Common/ObjectDisposedError.js";
import { Func } from "../../Common/Func.js";
import { CancellationToken } from "../../Common/Threading/CancellationToken.js";

/**
 * A {@link DelegatingHandler} that implements a global rate-limiting mechanism for Aula servers.
 * */
export class AulaGlobalRateLimiterHandler extends DelegatingHandler
{
	readonly #_eventEmitter: EventEmitter<AulaGlobalRateLimiterHandlerEvents> = new EventEmitter();
	readonly #_requestAvailableEvent: AutoResetEvent = new AutoResetEvent(true);
	#_requestLimit: number = 1;
	#_remainingRequests: number = 1;
	#_windowMilliseconds: number = 1;
	#_availableRequestEventId: NodeJS.Timeout | number | null = null;
	#_disposed: boolean = false;

	public constructor(innerHandler: HttpMessageHandler, disposeInnerHandler: boolean)
	{
		super(innerHandler, disposeInnerHandler);
		SealedClassError.throwIfNotEqual(AulaGlobalRateLimiterHandler, new.target);
	}

	public async send(message: HttpRequestMessage, cancellationToken: CancellationToken)
	{
		ThrowHelper.TypeError.throwIfNotType(message, HttpRequestMessage);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);

		while (true)
		{
			await this.#_requestAvailableEvent.waitOne(cancellationToken);

			if (this.#_remainingRequests === this.#_requestLimit)
			{
				this.#scheduleRequestReplenishment();
			}

			if (--this.#_remainingRequests > 0)
			{
				this.#_requestAvailableEvent.set();
			}

			const response = await super.send(message, cancellationToken);

			const requestLimitHeaderValues = response.headers.get("X-RateLimit-Global-Limit");
			const windowMillisecondsHeaderValues = response.headers.get("X-RateLimit-Global-WindowMilliseconds");
			if (requestLimitHeaderValues === undefined ||
			    windowMillisecondsHeaderValues === undefined)
			{
				// Endpoint does not account for global rate limits.
				return response;
			}

			const requestLimit = parseInt(requestLimitHeaderValues[0], 10);
			const windowMilliseconds = parseInt(windowMillisecondsHeaderValues[0], 10);
			if (requestLimit !== this.#_requestLimit ||
			    windowMilliseconds !== this.#_windowMilliseconds)
			{
				// This is the first time making a request and limits must be synced
				// or the global rate limits has been updated server-side.
				ValueOutOfRangeError.throwIfLessThan(requestLimit, 1);
				ValueOutOfRangeError.throwIfLessThan(windowMilliseconds, 1);

				this.#_requestLimit = requestLimit;
				this.#_windowMilliseconds = windowMilliseconds;
				this.#_remainingRequests = requestLimit - 1;
				if (this.#_remainingRequests > 0)
				{
					this.#_requestAvailableEvent.set();
				}

				this.#scheduleRequestReplenishment();
			}

			const isGlobalHeaderValues = response.headers.get("X-RateLimit-IsGlobal");
			const resetTimestampHeaderValues = response.headers.get("X-RateLimit-ResetsAt");
			if (isGlobalHeaderValues !== undefined &&
			    isGlobalHeaderValues[0] === "true" &&
			    resetTimestampHeaderValues !== undefined)
			{
				// There are no requests left, or we have reached an unexpected 429 http status code.
				const resetTimestamp = resetTimestampHeaderValues[0];
				this.#_requestAvailableEvent.reset();
				this.#scheduleRequestReplenishment(Date.now() - Date.parse(resetTimestamp));

				if (response.statusCode === HttpStatusCode.TooManyRequests)
				{
					await this.#_eventEmitter.emit("RateLimited", new RateLimitedEvent(resetTimestamp));
					continue;
				}
			}

			return response;
		}
	}

	/**
	 * Registers a listener for a specific event.
	 * @param event The name of the event to subscribe to.
	 * @param listener The callback function to invoke when the event occurs.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 */
	public on<TEvent extends keyof AulaGlobalRateLimiterHandlerEvents>(
		event: TEvent,
		listener: AulaGlobalRateLimiterHandlerEvents[TEvent])
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
	public remove<TEvent extends keyof AulaGlobalRateLimiterHandlerEvents>(
		event: TEvent,
		listener: AulaGlobalRateLimiterHandlerEvents[TEvent])
	{
		ThrowHelper.TypeError.throwIfNullable(event);
		ThrowHelper.TypeError.throwIfNotType(listener, "function");
		ObjectDisposedError.throwIf(this.#_disposed);

		return this.#_eventEmitter.remove(event, listener);
	}

	public dispose()
	{
		super.dispose();

		if (this.#_disposed)
		{
			return;
		}

		try
		{
			clearTimeout(this.#_availableRequestEventId ?? undefined);
		}
		catch (error)
		{
			if (!(error instanceof ReferenceError))
			{
				throw error;
			}
		}

		this.#_eventEmitter.dispose();
		this.#_requestAvailableEvent.dispose();

		this.#_disposed = true;
	}

	#scheduleRequestReplenishment(millisecondsWait?: number)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(millisecondsWait, "number", "undefined");

		if (this.#_availableRequestEventId !== null)
		{
			clearTimeout(this.#_availableRequestEventId as any);
		}

		const milliseconds = millisecondsWait ? millisecondsWait : this.#_windowMilliseconds;
		this.#_availableRequestEventId = setTimeout(() =>
		{
			this.#_remainingRequests = this.#_requestLimit;
			this.#_requestAvailableEvent.set();
		}, milliseconds);

	}
}

export interface AulaGlobalRateLimiterHandlerEvents
{
	RateLimited: Func<[ RateLimitedEvent ]>;
}

export class RateLimitedEvent
{
	readonly #_resetIsoString: string;
	#_resetDate: Date | null = null;

	public constructor(resetIsoString: string)
	{
		SealedClassError.throwIfNotEqual(RateLimitedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(resetIsoString, "string");

		this.#_resetIsoString = resetIsoString;
	}

	public get resetDate()
	{
		return this.#_resetDate ??= new Date(this.#_resetIsoString);
	}
}

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

export class AulaGlobalRateLimiterHandler extends DelegatingHandler
{
	readonly #_eventEmitter: EventEmitter<AulaGlobalRateLimiterHandlerEvents> = new EventEmitter();
	readonly #_requestAvailableEvent: AutoResetEvent = new AutoResetEvent(true);
	#_requestLimit: number = 1;
	#_remainingRequests: number = 1;
	#_windowMilliseconds: number = 1;
	#_availableRequestEventId: NodeJS.Timeout | number | null = null;
	#_disposed: boolean = false;

	public constructor(innerHandler: HttpMessageHandler)
	{
		super(innerHandler);
		SealedClassError.throwIfNotEqual(AulaGlobalRateLimiterHandler, new.target);
	}

	public async send(message: HttpRequestMessage)
	{
		ThrowHelper.TypeError.throwIfNotType(message, HttpRequestMessage);
		ObjectDisposedError.throwIf(this.#_disposed);

		while (true)
		{
			await this.#_requestAvailableEvent.waitOne();

			if (this.#_remainingRequests === this.#_requestLimit)
			{
				this.#scheduleRequestReplenishment();
			}

			if (--this.#_remainingRequests > 0)
			{
				this.#_requestAvailableEvent.set();
			}

			const response = await super.send(message);

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

	public on<TEvent extends keyof AulaGlobalRateLimiterHandlerEvents>(
		event: TEvent,
		listener: AulaGlobalRateLimiterHandlerEvents[TEvent])
	{
		ThrowHelper.TypeError.throwIfNullable(event);
		ThrowHelper.TypeError.throwIfNotType(listener, "function");
		ObjectDisposedError.throwIf(this.#_disposed);

		return this.#_eventEmitter.on(event, listener);
	}

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
		if (this.#_disposed)
		{
			return;
		}

		this.#_eventEmitter.dispose();
		this.#_requestAvailableEvent.dispose();
		try
		{
			(this.#_availableRequestEventId as NodeJS.Timeout).unref();
		}
		catch (error)
		{
			if (!(error instanceof ReferenceError))
			{
				throw error;
			}
		}

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

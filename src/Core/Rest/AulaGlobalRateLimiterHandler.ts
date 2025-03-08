import { DelegatingHandler } from "../../Common/Http/DelegatingHandler.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { EventEmitter } from "../../Common/Threading/EventEmitter.js";
import { Action } from "../../Common/Action.js";
import { HttpRequestMessage } from "../../Common/Http/HttpRequestMessage.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { HttpMessageHandler } from "../../Common/Http/HttpMessageHandler.js";
import { Temporal } from "@js-temporal/polyfill";
import { AutoResetEvent } from "../../Common/Threading/AutoResetEvent.js";
import { ValueOutOfRangeError } from "../../Common/ValueOutOfRangeError.js";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode.js";
import { ObjectDisposedError } from "../../Common/ObjectDisposedError.js";
import Instant = Temporal.Instant;
import Duration = Temporal.Duration;

export class AulaGlobalRateLimiterHandler extends DelegatingHandler
{
	readonly #eventEmitter: EventEmitter<AulaGlobalRateLimiterHandlerEvents> = new EventEmitter();
	readonly #requestAvailableEvent: AutoResetEvent = new AutoResetEvent(true);
	#requestLimit: number = 1;
	#remainingRequests: number = 1;
	#windowMilliseconds: number = 1;
	#availableRequestEventId: NodeJS.Timeout | number | null = null;
	#disposed: boolean = false;

	public constructor(innerHandler: HttpMessageHandler)
	{
		super(innerHandler);
		SealedClassError.throwIfNotEqual(AulaGlobalRateLimiterHandler, new.target);
	}

	public async send(message: HttpRequestMessage)
	{
		ObjectDisposedError.throwIf(this.#disposed);
		ThrowHelper.TypeError.throwIfNotType(message, HttpRequestMessage);

		while (true)
		{
			await this.#requestAvailableEvent.waitOne();

			if (this.#remainingRequests === this.#requestLimit)
			{
				this.#scheduleRequestReplenishment();
			}

			if (--this.#remainingRequests > 0)
			{
				this.#requestAvailableEvent.set();
			}

			const response = await super.send(message);

			const requestLimitHeaderValue = response.headers.get("X-RateLimit-Global-Limit");
			const windowMillisecondsHeaderValue = response.headers.get("X-RateLimit-Global-WindowMilliseconds");
			if (requestLimitHeaderValue === undefined ||
			    windowMillisecondsHeaderValue === undefined)
			{
				// Endpoint does not account for global rate limits.
				return response;
			}

			const requestLimit = parseInt(requestLimitHeaderValue, 10);
			const windowMilliseconds = parseInt(windowMillisecondsHeaderValue, 10);
			if (requestLimit !== this.#requestLimit ||
			    windowMilliseconds !== this.#windowMilliseconds)
			{
				// This is the first time making a request and limits must be synced
				// or the global rate limits has been updated server-side.
				ValueOutOfRangeError.throwIfLessThan(requestLimit, 1);
				ValueOutOfRangeError.throwIfLessThan(windowMilliseconds, 1);

				this.#requestLimit = requestLimit;
				this.#windowMilliseconds = windowMilliseconds;
				this.#remainingRequests = requestLimit - 1;
				if (this.#remainingRequests > 0)
				{
					this.#requestAvailableEvent.set();
				}

				this.#scheduleRequestReplenishment();
			}

			const isGlobalHeaderValue = response.headers.get("X-RateLimit-IsGlobal");
			const resetTimestampHeaderValue = response.headers.get("X-RateLimit-ResetsAt");
			if (isGlobalHeaderValue !== undefined &&
			    isGlobalHeaderValue === "true" &&
			    resetTimestampHeaderValue !== undefined)
			{
				// There are no requests left, or we have reached an unexpected 429 http status code.
				const resetInstant = Instant.from(resetTimestampHeaderValue);
				const timeUntilReset = Instant.from(resetTimestampHeaderValue).since(Temporal.Now.instant());

				this.#requestAvailableEvent.reset();
				this.#scheduleRequestReplenishment(timeUntilReset);

				if (response.statusCode === HttpStatusCode.TooManyRequests)
				{
					await this.#eventEmitter.emit("RateLimited", new RateLimitedEvent(resetInstant));
					continue;
				}
			}

			return response;
		}
	}

	public async on<TEvent extends keyof AulaGlobalRateLimiterHandlerEvents>(
		event: TEvent,
		listener: AulaGlobalRateLimiterHandlerEvents[TEvent])
	{
		ObjectDisposedError.throwIf(this.#disposed);
		return await this.#eventEmitter.on(event, listener);
	}

	public async remove<TEvent extends keyof AulaGlobalRateLimiterHandlerEvents>(
		event: TEvent,
		listener: AulaGlobalRateLimiterHandlerEvents[TEvent])
	{
		ObjectDisposedError.throwIf(this.#disposed);
		return await this.#eventEmitter.remove(event, listener);
	}

	public dispose()
	{
		if (this.#disposed)
		{
			return;
		}

		this.#eventEmitter.dispose();
		this.#requestAvailableEvent.dispose();

		this.#disposed = true;
	}

	#scheduleRequestReplenishment(wait?: Duration)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(wait, Duration, "undefined");

		if (this.#availableRequestEventId !== null)
		{
			clearTimeout(this.#availableRequestEventId as any);
		}

		const milliseconds = wait ? wait.milliseconds : this.#windowMilliseconds;
		this.#availableRequestEventId = setTimeout(() =>
		{
			this.#remainingRequests = this.#requestLimit;
			this.#requestAvailableEvent.set();
		}, milliseconds);

		this.#availableRequestEventId.unref();
	}
}

export interface AulaGlobalRateLimiterHandlerEvents
{
	RateLimited: Action<[ RateLimitedEvent ]>;
}

export class RateLimitedEvent
{
	readonly #resetInstant: Instant;

	public constructor(resetInstant: Instant)
	{
		SealedClassError.throwIfNotEqual(RateLimitedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(resetInstant, Instant);

		this.#resetInstant = resetInstant;
	}

	public get resetInstant()
	{
		return this.#resetInstant;
	}
}

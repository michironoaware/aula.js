import { SealedClassError } from "../../Common/SealedClassError.js";
import { DelegatingHandler } from "../../Common/Http/DelegatingHandler.js";
import { HttpMessageHandler } from "../../Common/Http/HttpMessageHandler.js";
import { HttpRequestMessage } from "../../Common/Http/HttpRequestMessage.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode.js";
import { HttpResponseMessage } from "../../Common/Http/HttpResponseMessage.js";
import { Delay } from "../../Common/Threading/Delay.js";
import { CancellationToken } from "../../Common/Threading/CancellationToken.js";
import { ObjectDisposedError } from "../../Common/ObjectDisposedError.js";

/**
 * A {@link DelegatingHandler} that implements a retry mechanism for handling HTTP 503 status codes.
 *
 * This handler attempts to send an HTTP request and, if the response has an HTTP 503 status code,
 * the handler will automatically retry sending the request with an exponentially increasing delay. The retry logic
 * continues until a response with a status code different from HTTP 503 is received.
 * */
export class AulaHttpStatusCode503Handler extends DelegatingHandler
{
	#_disposed: boolean = false;

	public constructor(innerHandler: HttpMessageHandler, disposeInnerHandler: boolean)
	{
		super(innerHandler, disposeInnerHandler);
		SealedClassError.throwIfNotEqual(AulaHttpStatusCode503Handler, new.target);
	}

	/**
	 * Send an HTTP request as an asynchronous operation.
	 * @returns The promise object representing the asynchronous operation.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @remarks The returned {@link Promise} will complete once the response has been received.
	 * */
	public async send(message: HttpRequestMessage, cancellationToken: CancellationToken)
	{
		ThrowHelper.TypeError.throwIfNotType(message, HttpRequestMessage);
		ObjectDisposedError.throwIf(this.#_disposed);

		let retryDelayMilliseconds = 0;
		let response: HttpResponseMessage;
		do
		{
			if (retryDelayMilliseconds !== 0)
			{
				await Delay(retryDelayMilliseconds);
			}
			else
			{
				retryDelayMilliseconds = 100;
			}

			if (retryDelayMilliseconds < 51_200)
			{
				retryDelayMilliseconds *= 2;
			}

			response = await super.send(message, cancellationToken);
		} while (response.statusCode === HttpStatusCode.InternalServerError);

		return response;
	}

	public [Symbol.asyncDispose]()
	{
		if (this.#_disposed)
		{
			return Promise.resolve();
		}

		this.#_disposed = true;
		return Promise.resolve();
	}
}

import { SealedClassError } from "../../Common/SealedClassError.js";
import { DelegatingHandler } from "../../Common/Http/DelegatingHandler.js";
import { HttpMessageHandler } from "../../Common/Http/HttpMessageHandler.js";
import { HttpRequestMessage } from "../../Common/Http/HttpRequestMessage.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { ObjectDisposedError } from "../../Common/ObjectDisposedError.js";
import { HttpMethod } from "../../Common/Http/HttpMethod.js";
import { Func } from "../../Common/Func.js";
import { CancellationToken } from "../../Common/Threading/CancellationToken.js";

/**
 * A {@link DelegatingHandler} that logs HTTP request and response information.
 * @sealed
 * */
export class HttpLoggingHandler extends DelegatingHandler
{
	readonly #_log: Func<[ string ]>;
	readonly #_sensitiveLogging: boolean;
	readonly #_headerLogging: boolean;
	#_disposed: boolean = false;

	/**
	 * Initializes a new instance of {@link HttpLoggingHandler}.
	 * @param innerHandler - The inner {@link HttpMessageHandler} to delegate requests to.
	 * @param disposeInnerHandler - Whether to dispose the inner handler when this handler is disposed.
	 * @param logFunc - A function that handles log output.
	 * @param sensitiveLogging - Whether to include sensitive data (e.g., `Authorization` headers) in logs.
	 * @param headerLogging - Whether to include request and response headers in logs.
	 */
	public constructor(
		innerHandler: HttpMessageHandler,
		disposeInnerHandler: boolean,
		logFunc: Func<[ string ]>,
		sensitiveLogging: boolean = false,
		headerLogging: boolean = false)
	{
		super(innerHandler, disposeInnerHandler);
		SealedClassError.throwIfNotEqual(HttpLoggingHandler, new.target);
		ThrowHelper.TypeError.throwIfNotType(logFunc, "function");
		ThrowHelper.TypeError.throwIfNotType(sensitiveLogging, "boolean");
		ThrowHelper.TypeError.throwIfNotType(headerLogging, "boolean");

		this.#_log = logFunc;
		this.#_sensitiveLogging = sensitiveLogging;
		this.#_headerLogging = headerLogging;
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
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);

		const response = await super.send(message, cancellationToken);

		let text =
			`${HttpMethod.name} to ${message.requestUri} ` +
			`${response.isSuccessStatusCode ? "Succeeded" : "Failed"} ` +
			`with status code ${response.statusCode}.`;

		if (this.#_headerLogging)
		{
			text += "- Request headers:\n";
			for (const header of message.headers)
			{
				let headerName = header[0];
				let headerValue = header[1];

				if (!this.#_sensitiveLogging && header[0] === "authorization")
				{
					headerValue = headerValue.map(() => "***");
				}

				text += `    ${headerName}: ${headerValue.join("; ")}\n`;
			}

			text += `- Response headers:\n`;
			for (const header of response.headers)
			{
				text += `    ${header[0]}: ${header[1]}\n`;
			}
		}

		this.#_log(text);

		return response;
	}

	public async [Symbol.asyncDispose]()
	{
		await super[Symbol.asyncDispose]();

		if (this.#_disposed)
		{
			return;
		}

		this.#_disposed = true;
	}
}

import { HttpMessageHandler } from "../../Common/Http/HttpMessageHandler";
import { HttpRequestMessage } from "../../Common/Http/HttpRequestMessage";
import { HttpResponseMessage } from "../../Common/Http/HttpResponseMessage";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode";
import { StreamContent } from "../../Common/Http/StreamContent";
import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";
import { CancellationToken } from "../../Common/Threading/CancellationToken";
import { OperationCanceledError } from "../../Common/Threading/OperationCanceledError";
import { ObjectDisposedError } from "../../Common/ObjectDisposedError";

/**
 * A {@link HttpMessageHandler} implementation that sends HTTP requests using the Fetch API.
 * @sealed
 * */
export class HttpFetchHandler extends HttpMessageHandler
{
	#_disposed: boolean = false;

	constructor()
	{
		super();
		SealedClassError.throwIfNotEqual(HttpFetchHandler, new.target);
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

		let abortSignal: AbortSignal | null = null;
		if (cancellationToken !== CancellationToken.none)
		{
			const abortController = new AbortController();
			abortSignal = abortController.signal;
			cancellationToken.onCancelled(() => abortController.abort());
		}

		let received: Response | null = null;
		try
		{
			received = await fetch(message.requestUri,
				{
					method: message.method.name,
					headers: Array.from(message.headers).map(v => [ v[0], v[1].join(";") ]),
					body: await message.content?.readAsStream(),
					duplex: "half",
					abort: abortSignal,
				} as RequestInit);
		}
		catch (error)
		{
			if (!(error instanceof DOMException) ||
			    error.name !== "AbortError")
			{
				throw error;
			}

			throw new OperationCanceledError();
		}

		const response = new HttpResponseMessage(received.status as HttpStatusCode);

		if (received.body)
		{
			response.content = new StreamContent(received.body);
		}

		for (const header of received.headers)
		{
			const headerName = header[0];
			const headerValues = header[1].split(";");
			for (const headerValue of headerValues)
			{
				response.headers.append(headerName, headerValue);
			}
		}

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

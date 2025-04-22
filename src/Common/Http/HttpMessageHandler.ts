import { HttpRequestMessage } from "./HttpRequestMessage.js";
import { HttpResponseMessage } from "./HttpResponseMessage.js";
import { CancellationToken } from "../Threading/CancellationToken.js";
import { IAsyncDisposable } from "../IAsyncDisposable.js";

/**
 * A base type for HTTP message handlers. Responsible for processing HTTP messages.
 * */
export abstract class HttpMessageHandler implements IAsyncDisposable
{
	/**
	 * Send an HTTP request as an asynchronous operation.
	 * @returns The promise object representing the asynchronous operation.
	 * @remarks The returned {@link Promise} will complete once the response has been received.
	 * */
	public abstract send(message: HttpRequestMessage, cancellationToken: CancellationToken): Promise<HttpResponseMessage>;

	public abstract [Symbol.asyncDispose](): Promise<void>;
}

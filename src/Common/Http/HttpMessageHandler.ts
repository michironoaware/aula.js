import { HttpRequestMessage } from "./HttpRequestMessage";
import { HttpResponseMessage } from "./HttpResponseMessage";
import { CancellationToken } from "../Threading/CancellationToken";
import { IAsyncDisposable } from "../IAsyncDisposable";

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

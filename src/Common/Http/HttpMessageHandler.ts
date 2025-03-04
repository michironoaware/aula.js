import { HttpRequestMessage } from "./HttpRequestMessage.js";
import { HttpResponseMessage } from "./HttpResponseMessage.js";
import { IDisposable } from "../IDisposable.js";

export abstract class HttpMessageHandler implements IDisposable
{
	public abstract send(message: HttpRequestMessage): Promise<HttpResponseMessage>;

	public abstract dispose(): void;
}

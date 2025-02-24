import { HttpRequestMessage } from "./HttpRequestMessage.js";
import { HttpResponseMessage } from "./HttpResponseMessage.js";

export abstract class HttpMessageHandler
{
	public abstract Send(message: HttpRequestMessage): Promise<HttpResponseMessage>;
}

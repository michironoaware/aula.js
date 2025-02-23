import { HttpMessageHandler } from "./HttpMessageHandler.js";
import { HttpRequestMessage } from "./HttpRequestMessage.js";

export abstract class DelegatingHandler extends HttpMessageHandler
{
	abstract innerHandler: HttpMessageHandler;

	async Send(message: HttpRequestMessage)
	{
		return await this.innerHandler.Send(message);
	}
}

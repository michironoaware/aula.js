import { ThrowHelper } from "../ThrowHelper.js";
import { HttpMessageHandler } from "./HttpMessageHandler.js";
import { HttpRequestMessage } from "./HttpRequestMessage.js";

export abstract class DelegatingHandler extends HttpMessageHandler
{
	readonly #innerHandler: HttpMessageHandler;

	public constructor(innerHandler: HttpMessageHandler)
	{
		ThrowHelper.TypeError.throwIfNotType(innerHandler, HttpMessageHandler);
		super();
		
		this.#innerHandler = innerHandler;
	}

	get innerHandler()
	{
		return this.#innerHandler;
	}

	async Send(message: HttpRequestMessage)
	{
		return await this.#innerHandler.Send(message);
	}
}

import { ThrowHelper } from "../ThrowHelper.js";
import { HttpMessageHandler } from "./HttpMessageHandler.js";
import { HttpRequestMessage } from "./HttpRequestMessage.js";

export abstract class DelegatingHandler extends HttpMessageHandler
{
	readonly #innerHandler: HttpMessageHandler;

	protected constructor(innerHandler: HttpMessageHandler)
	{
		ThrowHelper.TypeError.throwIfNotType(innerHandler, HttpMessageHandler);
		super();
		
		this.#innerHandler = innerHandler;
	}

	public get innerHandler()
	{
		return this.#innerHandler;
	}

	public async send(message: HttpRequestMessage)
	{
		return await this.#innerHandler.send(message);
	}
}

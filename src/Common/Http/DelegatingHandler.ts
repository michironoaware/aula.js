import { ThrowHelper } from "../ThrowHelper.js";
import { HttpMessageHandler } from "./HttpMessageHandler.js";
import { HttpRequestMessage } from "./HttpRequestMessage.js";

export abstract class DelegatingHandler extends HttpMessageHandler
{
	readonly #_innerHandler: HttpMessageHandler;

	protected constructor(innerHandler: HttpMessageHandler)
	{
		super();
		ThrowHelper.TypeError.throwIfNotType(innerHandler, HttpMessageHandler);

		this.#_innerHandler = innerHandler;
	}

	public get innerHandler()
	{
		return this.#_innerHandler;
	}

	public async send(message: HttpRequestMessage)
	{
		return await this.#_innerHandler.send(message);
	}
}

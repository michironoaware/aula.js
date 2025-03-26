import { ThrowHelper } from "../ThrowHelper.js";
import { HttpMessageHandler } from "./HttpMessageHandler.js";
import { HttpRequestMessage } from "./HttpRequestMessage.js";

/**
 * A type for HTTP handlers that delegate the processing of HTTP response messages to another handler, called the inner handler.
 * */
export abstract class DelegatingHandler extends HttpMessageHandler
{
	readonly #_innerHandler: HttpMessageHandler;

	/**
	 * Initializes a new instance of the {@link DelegatingHandler} class with a specific inner handler.
	 * @param innerHandler The inner handler to delegate the processing of HTTP response messages.
	 * */
	protected constructor(innerHandler: HttpMessageHandler)
	{
		super();
		ThrowHelper.TypeError.throwIfNotType(innerHandler, HttpMessageHandler);

		this.#_innerHandler = innerHandler;
	}

	/**
	 * Gets the inner handler which processes the HTTP response messages.
	 * */
	public get innerHandler()
	{
		return this.#_innerHandler;
	}

	public async send(message: HttpRequestMessage)
	{
		return await this.#_innerHandler.send(message);
	}
}

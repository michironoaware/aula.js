import { ThrowHelper } from "../ThrowHelper.js";
import { HttpMessageHandler } from "./HttpMessageHandler.js";
import { HttpRequestMessage } from "./HttpRequestMessage.js";
import { CancellationToken } from "../Threading/CancellationToken.js";

/**
 * A type for HTTP handlers that delegate the processing of HTTP response messages to another handler, called the inner handler.
 * */
export abstract class DelegatingHandler extends HttpMessageHandler
{
	readonly #_innerHandler: HttpMessageHandler;

	/**
	 * Initializes a new instance of the {@link DelegatingHandler} class with a specific inner handler.
	 * @param innerHandler The inner handler to delegate the processing of HTTP response messages.
	 * @privateRemarks This constructor needs to be public to prevent a TS2345 warning when using {@link TypeHelper} methods.
	 * */
	// noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
	public constructor(innerHandler: HttpMessageHandler)
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

	public async send(message: HttpRequestMessage, cancellationToken: CancellationToken)
	{
		return await this.#_innerHandler.send(message, cancellationToken);
	}
}

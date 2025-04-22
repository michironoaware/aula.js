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
	readonly #_disposeInnerHandler: boolean;

	/**
	 * Initializes a new instance of the {@link DelegatingHandler} class with a specific inner handler.
	 * @param innerHandler The inner handler to delegate the processing of HTTP response messages.
	 * @param disposeInnerHandler Whether the delegating handler should dispose the innerHandler when disposing.
	 * @privateRemarks This constructor needs to be public to prevent a TS2345 warning when using {@link TypeHelper} methods.
	 * */
	// noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
	public constructor(innerHandler: HttpMessageHandler, disposeInnerHandler: boolean)
	{
		super();
		ThrowHelper.TypeError.throwIfNotType(innerHandler, HttpMessageHandler);
		ThrowHelper.TypeError.throwIfNotType(disposeInnerHandler, "boolean");

		this.#_innerHandler = innerHandler;
		this.#_disposeInnerHandler = disposeInnerHandler;
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

	public async [Symbol.asyncDispose]()
	{
		if (this.#_disposeInnerHandler)
		{
			await this.#_innerHandler[Symbol.asyncDispose]();
		}
	}
}

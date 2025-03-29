import { HttpRequestMessage } from "./HttpRequestMessage.js";
import { HeaderMap } from "./HeaderMap.js";
import { HttpMessageHandler } from "./HttpMessageHandler.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { InvalidOperationError } from "../InvalidOperationError.js";
import { SealedClassError } from "../SealedClassError.js";
import { IDisposable } from "../IDisposable.js";

/**
 * Provides a class for sending HTTP requests and receiving HTTP responses from a resource identified by a URI.
 * */
export class HttpClient implements IDisposable
{
	readonly #_handler: HttpMessageHandler;
	readonly #_disposeHandler: boolean;
	#_baseAddress: URL | null = null;
	#_defaultRequestHeaders: HeaderMap = new HeaderMap();
	#_disposed: boolean = false;

	/**
	 * Initializes a new instance that will use the provided {@link handler}.
	 * @param handler The {@link HttpMessageHandler} responsible for processing the HTTP messages.
	 * @param disposeHandler true if the inner handler should be disposed of by {@link HttpClient.dispose};
	 *                       false if you intend to reuse the inner handler.
	 * */
	public constructor(handler: HttpMessageHandler, disposeHandler: boolean = false)
	{
		SealedClassError.throwIfNotEqual(HttpClient, new.target);
		ThrowHelper.TypeError.throwIfNotType(handler, HttpMessageHandler);
		ThrowHelper.TypeError.throwIfNotType(disposeHandler, "boolean");

		this.#_handler = handler;
		this.#_disposeHandler = disposeHandler;
	}

	/**
	 * Gets or sets the base address of Uniform Resource Identifier (URI) of the Internet resource used when sending requests.
	 * */
	public get baseAddress()
	{
		return this.#_baseAddress;
	}

	public set baseAddress(value: URL | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(value, URL, "null");
		this.#_baseAddress = value;
	}

	/**
	 * Gets the headers which should be sent with each request.
	 * */
	public get defaultRequestHeaders()
	{
		return this.#_defaultRequestHeaders;
	}

	/**
	 * Send an HTTP request as an asynchronous operation.
	 * */
	public async send(message: HttpRequestMessage)
	{
		ThrowHelper.TypeError.throwIfNotType(message, HttpRequestMessage);

		if (!(message.requestUri instanceof URL))
		{
			let requestUri: URL;
			try
			{
				// Throws a TypeError if the uri is not absolute.
				requestUri = new URL(message.requestUri);
			}
			catch (error)
			{
				if (!(error instanceof TypeError))
				{
					// Rethrow unwanted error type.
					throw error;
				}

				if (this.#_baseAddress === null)
				{
					throw new InvalidOperationError("The HttpClient has no base address set, the request uri cannot be relative");
				}

				requestUri = new URL(message.requestUri, this.#_baseAddress.href);
			}

			message.requestUri = requestUri;
		}

		message.content?.headers.forEach((headerValues, headerName) =>
		{
			if (message.headers.has(headerName))
			{
				message.headers.delete(headerName);
			}

			for (const headerValue of headerValues)
			{
				message.headers.append(headerName, headerValue);
			}
		});

		this.#_defaultRequestHeaders.forEach((headerValues, headerName) =>
		{
			if (!message.headers.has(headerName))
			{
				for (const headerValue of headerValues)
				{
					message.headers.append(headerName, headerValue);
				}
			}
		});

		const response = await this.#_handler.send(message);

		message.dispose();
		return response;
	}

	public dispose()
	{
		if (this.#_disposed)
		{
			return;
		}

		if (this.#_disposeHandler)
		{
			this.#_handler.dispose();
		}

		this.#_disposed = true;
	}
}

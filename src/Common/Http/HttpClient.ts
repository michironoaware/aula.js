import { HttpRequestMessage } from "./HttpRequestMessage.js";
import { HeaderMap } from "./HeaderMap.js";
import { HttpMessageHandler } from "./HttpMessageHandler.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { InvalidOperationError } from "../InvalidOperationError.js";
import { SealedClassError } from "../SealedClassError.js";

export class HttpClient
{
	readonly #_handler: HttpMessageHandler;
	#_baseUri: URL | null = null;
	#_defaultRequestHeaders: HeaderMap = new HeaderMap();

	public constructor(options: { handler: HttpMessageHandler })
	{
		SealedClassError.throwIfNotEqual(HttpClient, new.target);
		ThrowHelper.TypeError.throwIfNullable(options);
		ThrowHelper.TypeError.throwIfNotAnyType(options.handler, HttpMessageHandler);

		this.#_handler = options.handler;
	}

	public get baseUri()
	{
		return this.#_baseUri;
	}

	public set baseUri(value: URL | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(value, URL, "null");
		this.#_baseUri = value;
	}

	public get defaultRequestHeaders()
	{
		return this.#_defaultRequestHeaders;
	}

	public get handler()
	{
		return this.#_handler;
	}

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

				if (this.#_baseUri === null)
				{
					throw new InvalidOperationError("The HttpClient has no baseUri set, the request uri cannot be relative");
				}

				requestUri = new URL(message.requestUri, this.#_baseUri.href);
			}

			message.requestUri = requestUri;
		}

		message.content?.headers.forEach((value, name) =>
		{
			if (message.headers.has(name))
			{
				message.headers.delete(name);
			}

			message.headers.append(name, value);
		});

		this.#_defaultRequestHeaders.forEach((value, name) =>
		{
			if (!message.headers.has(name))
			{
				message.headers.append(name, value);
			}
		});

		const response = await this.#_handler.send(message);

		message.dispose();
		return response;
	}
}

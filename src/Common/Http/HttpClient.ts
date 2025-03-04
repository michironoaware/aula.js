import { HttpRequestMessage } from "./HttpRequestMessage.js";
import { HeaderMap } from "./HeaderMap.js";
import { HttpMessageHandler } from "./HttpMessageHandler.js";
import { HttpFetchHandler } from "./HttpFetchHandler.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { InvalidOperationError } from "../InvalidOperationError.js";
import { SealedClassError } from "../SealedClassError.js";

export class HttpClient
{
	readonly #handler: HttpMessageHandler;
	#baseUri: URL | null = null;
	#defaultRequestHeaders: HeaderMap = new HeaderMap();

	public constructor(options: { handler?: HttpMessageHandler; } = {})
	{
		SealedClassError.throwIfNotEqual(HttpClient, new.target);
		ThrowHelper.TypeError.throwIfNullable(options);
		ThrowHelper.TypeError.throwIfNotAnyType(options.handler, HttpMessageHandler, "undefined");

		this.#handler = options.handler ?? new HttpFetchHandler();
	}

	public get baseUri()
	{
		return this.#baseUri;
	}

	public set baseUri(value: URL | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(value, URL, "null");
		this.#baseUri = value;
	}

	public get defaultRequestHeaders()
	{
		return this.#defaultRequestHeaders;
	}

	public get handler()
	{
		return this.#handler;
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

				if (this.#baseUri === null)
				{
					throw new InvalidOperationError("The HttpClient has no baseUri set, the request uri cannot be relative.");
				}

				requestUri = new URL(message.requestUri, this.#baseUri.href);
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

		this.#defaultRequestHeaders.forEach((value, name) =>
		{
			if (!message.headers.has(name))
			{
				message.headers.append(name, value);
			}
		});

		const response = await this.#handler.send(message);

		message.dispose();
		return response;
	}
}

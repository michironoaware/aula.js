import { HttpRequestMessage } from "./HttpRequestMessage.js";
import { HeaderMap } from "./HeaderMap.js";
import { HttpMessageHandler } from "./HttpMessageHandler.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { InvalidOperationError } from "../InvalidOperationError.js";
import { SealedClassError } from "../SealedClassError.js";

export class HttpClient
{
	readonly #_handler: HttpMessageHandler;
	#_baseAddress: URL | null = null;
	#_defaultRequestHeaders: HeaderMap = new HeaderMap();

	public constructor(handler: HttpMessageHandler)
	{
		SealedClassError.throwIfNotEqual(HttpClient, new.target);
		ThrowHelper.TypeError.throwIfNotType(handler, HttpMessageHandler);

		this.#_handler = handler;
	}

	public get baseAddress()
	{
		return this.#_baseAddress;
	}

	public set baseAddress(value: URL | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(value, URL, "null");
		this.#_baseAddress = value;
	}

	public get defaultRequestHeaders()
	{
		return this.#_defaultRequestHeaders;
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

				if (this.#_baseAddress === null)
				{
					throw new InvalidOperationError("The HttpClient has no base address set, the request uri cannot be relative");
				}

				requestUri = new URL(message.requestUri, this.#_baseAddress.href);
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

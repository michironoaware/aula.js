import { HttpMethod } from "./HttpMethod.js";
import { HttpContent } from "./HttpContent.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { HeaderMap } from "./HeaderMap.js";
import { IDisposable } from "../IDisposable.js";
import { ObjectDisposedError } from "../ObjectDisposedError.js";
import { SealedClassError } from "../SealedClassError.js";

/**
 * Represents an HTTP request message.
 * @remarks The {@link HttpRequestMessage} class contains headers, the HTTP verb, and potentially data.
 *          An {@link HttpRequestMessage} instance should not be modified and/or reused after being sent.
 * */
export class HttpRequestMessage implements IDisposable
{
	readonly #_headers: HeaderMap;
	#_method: HttpMethod;
	#_requestUri: URL | string;
	#_content: HttpContent | null;
	#_disposed: boolean = false;

	/**
	 * Initializes a new instance of the HttpRequestMessage class with an HTTP method and a request Uri.
	 * @param method The HTTP method.
	 * @param requestUri The Uri to request.
	 * */
	public constructor(method: HttpMethod, requestUri: URL | string)
	{
		SealedClassError.throwIfNotEqual(HttpRequestMessage, new.target);
		ThrowHelper.TypeError.throwIfNotType(method, HttpMethod);
		ThrowHelper.TypeError.throwIfNotAnyType(requestUri, URL, "string");

		this.#_method = method;
		this.#_requestUri = requestUri;
		this.#_headers = new HeaderMap();
		this.#_content = null;
	}

	/**
	 * Gets or sets the HTTP method used by the HTTP request message.
	 * */
	public get method()
	{
		return this.#_method;
	}

	public set method(value: HttpMethod)
	{
		ThrowHelper.TypeError.throwIfNotType(value, HttpMethod);

		this.#_method = value;
	}

	/**
	 * Gets or sets the Uri used for the HTTP request.
	 * */
	public get requestUri()
	{
		return this.#_requestUri;
	}

	public set requestUri(value: URL | string)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(value, URL, "string");

		this.#_requestUri = value;
	}

	/**
	 * Gets the collection of HTTP request headers.
	 * */
	public get headers()
	{
		return this.#_headers;
	}

	/**
	 * Gets or sets the contents of the HTTP message.
	 * */
	public get content()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return this.#_content;
	}

	public set content(value: HttpContent | null)
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		ThrowHelper.TypeError.throwIfNotAnyType(value, HttpContent, "null");

		this.#_content = value;
	}

	public dispose()
	{
		if (this.#_disposed)
		{
			return;
		}

		this.content?.dispose();
		this.#_disposed = true;
	}
}

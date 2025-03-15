import { HttpMethod } from "./HttpMethod.js";
import { HttpContent } from "./HttpContent.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { HeaderMap } from "./HeaderMap.js";
import { IDisposable } from "../IDisposable.js";
import { ObjectDisposedError } from "../ObjectDisposedError.js";
import { SealedClassError } from "../SealedClassError.js";

export class HttpRequestMessage implements IDisposable
{
	readonly #_headers: HeaderMap;
	#_method: HttpMethod;
	#_requestUri: URL | string;
	#_content: HttpContent | null;
	#_disposed: boolean = false;

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

	public get method()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return this.#_method;
	}

	public set method(value: HttpMethod)
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		ThrowHelper.TypeError.throwIfNotType(value, HttpMethod);

		this.#_method = value;
	}

	public get requestUri()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return this.#_requestUri;
	}

	public set requestUri(value: URL | string)
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		ThrowHelper.TypeError.throwIfNotAnyType(value, URL, "string");

		this.#_requestUri = value;
	}

	public get headers()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return this.#_headers;
	}

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

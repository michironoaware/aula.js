import {HttpMethod} from "./HttpMethod.js";
import {HttpContent} from "./HttpContent.js";
import {ThrowHelper} from "../ThrowHelper.js";
import {HeaderMap} from "./HeaderMap.js";
import {IDisposable} from "../IDisposable.js";
import {ObjectDisposedError} from "../ObjectDisposedError.js";
import {SealedClassError} from "../SealedClassError.js";

export class HttpRequestMessage implements IDisposable
{
	readonly #headers: HeaderMap;
	#method: HttpMethod;
	#requestUri: URL | string;
	#content: HttpContent | null;
	#disposed: boolean = false;

	public constructor(method: HttpMethod, requestUri: URL | string)
	{
		SealedClassError.throwIfNotEqual(HttpRequestMessage, new.target);
		ThrowHelper.TypeError.throwIfNotType(method, HttpMethod);
		ThrowHelper.TypeError.throwIfNotAnyType(requestUri, URL, "string");

		this.#method = method;
		this.#requestUri = requestUri;
		this.#headers = new HeaderMap();
		this.#content = null;
	}

	public dispose()
	{
		if (this.#disposed)
		{
			return;
		}

		this.content?.dispose();
		this.#disposed = true;
    }

	public get method()
	{
		ObjectDisposedError.throwIf(this.#disposed);
		return this.#method;
	}

	public set method(value: HttpMethod)
	{
		ObjectDisposedError.throwIf(this.#disposed);
		ThrowHelper.TypeError.throwIfNotType(value, HttpMethod);

		this.#method = value;
	}

	public get requestUri()
	{
		ObjectDisposedError.throwIf(this.#disposed);
		return this.#requestUri;
	}

	public set requestUri(value: URL | string)
	{
		ObjectDisposedError.throwIf(this.#disposed);
		this.#requestUri = value;
	}

	public get headers()
	{
		ObjectDisposedError.throwIf(this.#disposed);
		return this.#headers;
	}

	public get content()
	{
		ObjectDisposedError.throwIf(this.#disposed);
		return this.#content;
	}

	public set content(value: HttpContent | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(value, HttpContent, "null");
		ObjectDisposedError.throwIf(this.#disposed);

		this.#content = value;
	}
}

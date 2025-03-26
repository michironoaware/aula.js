import { HttpStatusCode } from "./HttpStatusCode.js";
import { HttpContent } from "./HttpContent.js";
import { HttpRequestError } from "./HttpRequestError.js";
import { SealedClassError } from "../SealedClassError.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { EmptyContent } from "./EmptyContent.js";
import { HeaderMap } from "./HeaderMap.js";

export class HttpResponseMessage
{
	#_statusCode: HttpStatusCode;
	#_content: HttpContent = new EmptyContent();
	#_headers: HeaderMap = new HeaderMap();

	public constructor(statusCode: HttpStatusCode)
	{
		SealedClassError.throwIfNotEqual(HttpResponseMessage, new.target);
		ThrowHelper.TypeError.throwIfNotType(statusCode, "number");

		this.#_statusCode = statusCode;
	}

	public get statusCode()
	{
		return this.#_statusCode;
	}

	public set statusCode(value: HttpStatusCode)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		this.#_statusCode = value;
	}

	public get content()
	{
		return this.#_content;
	}

	public set content(value: HttpContent)
	{
		ThrowHelper.TypeError.throwIfNotType(value, HttpContent);
		this.#_content = value;
	}

	public get headers()
	{
		return this.#_headers;
	}

	public get isSuccessStatusCode()
	{
		return this.#_statusCode >= 200 && this.#_statusCode < 300;
	}

	public ensureSuccessStatusCode()
	{
		if (!this.isSuccessStatusCode)
		{
			throw new HttpRequestError(null, this.statusCode);
		}
	}
}

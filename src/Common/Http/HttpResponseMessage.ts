import { HttpStatusCode } from "./HttpStatusCode.js";
import { HttpContent } from "./HttpContent.js";
import { ReadonlyMapWrapper } from "../Collections/ReadonlyMapWrapper.js";
import { HttpRequestError } from "./HttpRequestError.js";
import { SealedClassError } from "../SealedClassError.js";
import { ThrowHelper } from "../ThrowHelper.js";

export class HttpResponseMessage
{
	readonly #_statusCode: HttpStatusCode;
	readonly #_content: HttpContent;
	readonly #_headers: ReadonlyMap<string, string>;

	public constructor(statusCode: HttpStatusCode, content: HttpContent, headers: ReadonlyMap<string, string>)
	{
		SealedClassError.throwIfNotEqual(HttpResponseMessage, new.target);
		ThrowHelper.TypeError.throwIfNotType(statusCode, "number");
		ThrowHelper.TypeError.throwIfNotType(content, HttpContent);
		ThrowHelper.TypeError.throwIfNullable(headers);

		this.#_statusCode = statusCode;
		this.#_content = content;
		this.#_headers = new ReadonlyMapWrapper(headers);
	}

	public get statusCode()
	{
		return this.#_statusCode;
	}

	public get content()
	{
		return this.#_content;
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

import { HttpStatusCode } from "./HttpStatusCode.js";
import { HttpContent } from "./HttpContent.js";
import { ReadonlyMapWrapper } from "../Collections/ReadonlyMapWrapper.js";
import { HttpRequestError } from "./HttpRequestError.js";
import { SealedClassError } from "../SealedClassError.js";
import { ThrowHelper } from "../ThrowHelper.js";

export class HttpResponseMessage
{
	readonly #statusCode: HttpStatusCode;
	readonly #content: HttpContent;
	readonly #headers: ReadonlyMap<string, string>;

	public constructor(statusCode: HttpStatusCode, content: HttpContent, headers: ReadonlyMap<string, string>)
	{
		SealedClassError.throwIfNotEqual(HttpResponseMessage, new.target);
		ThrowHelper.TypeError.throwIfNotType(statusCode, "number");
		ThrowHelper.TypeError.throwIfNotType(content, HttpContent);
		ThrowHelper.TypeError.throwIfNullable(headers);

		this.#statusCode = statusCode;
		this.#content = content;
		this.#headers = new ReadonlyMapWrapper(headers);
	}

	public get statusCode()
	{
		return this.#statusCode;
	}

	public get content()
	{
		return this.#content;
	}

	public get headers()
	{
		return this.#headers;
	}

	public get isSuccessStatusCode()
	{
		return this.#statusCode >= 200 && this.#statusCode < 300;
	}

	public ensureSuccessStatusCode()
	{
		if (!this.isSuccessStatusCode)
		{
			throw new HttpRequestError(this.statusCode);
		}
	}
}

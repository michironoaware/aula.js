import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";

export class AulaRestError extends Error
{
	readonly #content: string | null;
	readonly #innerError: HttpRequestError | null;

	public constructor(
		message: string,
		content: string | null,
		innerError: HttpRequestError | null = null)
	{
		super(`${message}.${content ? `\n${content}` : ""}`);
		ThrowHelper.TypeError.throwIfNotAnyType(message, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(content, "string", "null");
		ThrowHelper.TypeError.throwIfNotAnyType(innerError, HttpRequestError, "null");

		this.#content = content;
		this.#innerError = innerError;
	}

	public get content()
	{
		return this.#content;
	}

	public get innerError()
	{
		return this.#innerError;
	}
}

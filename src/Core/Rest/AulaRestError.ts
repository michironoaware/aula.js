import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode.js";

export class AulaRestError extends Error
{
	readonly #_title: string;
	readonly #_detail: string;
	readonly #_status: HttpStatusCode;
	readonly #_innerError: HttpRequestError | null;

	public constructor(
		message: string,
		title: string,
		detail: string,
		status: HttpStatusCode,
		innerError: HttpRequestError | null = null)
	{
		super(`${message}.\nTitle: ${title}\nDetail: ${detail}\nStatus: ${status}`);
		ThrowHelper.TypeError.throwIfNotAnyType(message, "string");
		ThrowHelper.TypeError.throwIfNotType(title, "string");
		ThrowHelper.TypeError.throwIfNotType(detail, "string");
		ThrowHelper.TypeError.throwIfNotType(status, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(innerError, HttpRequestError, "null");

		this.#_title = title;
		this.#_detail = detail;
		this.#_status = status;
		this.#_innerError = innerError;
	}

	public get innerError()
	{
		return this.#_innerError;
	}

	public get title()
	{
		return this.#_title;
	}

	public get detail()
	{
		return this.#_detail;
	}

	public get status()
	{
		return this.#_status;
	}
}

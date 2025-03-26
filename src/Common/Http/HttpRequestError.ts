import { HttpStatusCode } from "./HttpStatusCode.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { SealedClassError } from "../SealedClassError.js";

export class HttpRequestError extends Error
{
	readonly #_statusCode: HttpStatusCode | null;

	public constructor(message: string | null = null, statusCode: HttpStatusCode | null = null)
	{
		SealedClassError.throwIfNotEqual(HttpRequestError, new.target);
		ThrowHelper.TypeError.throwIfNotAnyType(message, "string", "null");
		ThrowHelper.TypeError.throwIfNotAnyType(statusCode, "number", "null");

		super(message ? message : `Http request error failed` + statusCode ? ` with status code '${statusCode}'` : "");
		this.#_statusCode = statusCode;
	}

	public get statusCode()
	{
		return this.#_statusCode;
	}
}

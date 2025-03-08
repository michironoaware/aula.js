import { HttpStatusCode } from "./HttpStatusCode.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { SealedClassError } from "../SealedClassError.js";

export class HttpRequestError extends Error
{
	readonly #statusCode: HttpStatusCode;

	public constructor(statusCode: HttpStatusCode)
	{
		SealedClassError.throwIfNotEqual(HttpRequestError, new.target);
		ThrowHelper.TypeError.throwIfNotType(statusCode, "number");

		super(`Http request error failed with status code '${statusCode}'`);
		this.#statusCode = statusCode;
	}

	public get statusCode()
	{
		return this.#statusCode;
	}
}

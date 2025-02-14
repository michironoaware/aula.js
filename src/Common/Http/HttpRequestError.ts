import {HttpStatusCode} from "./HttpStatusCode.js";
import {ThrowHelper} from "../ThrowHelper.js";

export class HttpRequestError extends Error
{
	readonly #statusCode: HttpStatusCode;

	public constructor(statusCode: HttpStatusCode)
	{
		ThrowHelper.TypeError.throwIfNotType(statusCode, Number);

		super(`Http request error failed with status code '${statusCode}'.`);
		this.#statusCode = statusCode;
	}

	public get statusCode()
	{
		return this.#statusCode;
	}
}

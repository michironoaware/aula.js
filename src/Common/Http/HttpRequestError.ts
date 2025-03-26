import { HttpStatusCode } from "./HttpStatusCode.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { SealedClassError } from "../SealedClassError.js";

/**
 * A base class for exceptions thrown by the {@link HttpClient} and {@link HttpMessageHandler} classes.
 * */
export class HttpRequestError extends Error
{
	readonly #_statusCode: HttpStatusCode | null;

	/**
	 * Initializes a new instance of the {@link HttpRequestError} class
	 * with a specific message that describes the current error and a statusCode.
	 * @param message A message that describes the current error.
	 * @param statusCode The status code of the HTTP response that caused the error.
	 * */
	public constructor(message: string | null = null, statusCode: HttpStatusCode | null = null)
	{
		SealedClassError.throwIfNotEqual(HttpRequestError, new.target);
		ThrowHelper.TypeError.throwIfNotAnyType(message, "string", "null");
		ThrowHelper.TypeError.throwIfNotAnyType(statusCode, "number", "null");

		super(message ? message : `Http request error failed` + statusCode ? ` with status code '${statusCode}'` : "");
		this.#_statusCode = statusCode;
	}

	/**
	 * Gets the {@link HttpStatusCode} of the HTTP response that caused the error.
	 * */
	public get statusCode()
	{
		return this.#_statusCode;
	}
}

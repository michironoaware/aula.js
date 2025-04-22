import { HttpStatusCode } from "./HttpStatusCode";
import { ThrowHelper } from "../ThrowHelper";
import { SealedClassError } from "../SealedClassError";

/**
 * A base class for exceptions thrown by the {@link HttpClient} and {@link HttpMessageHandler} classes.
 * @sealed
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
	public constructor(message?: string, statusCode?: HttpStatusCode)
	{
		SealedClassError.throwIfNotEqual(HttpRequestError, new.target);
		ThrowHelper.TypeError.throwIfNotAnyType(message, "string", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(statusCode, "number", "undefined");

		super(message ? message : `Http request error failed` + statusCode ? ` with status code '${statusCode}'` : "");
		this.#_statusCode = statusCode ?? null;
	}

	/**
	 * Gets the {@link HttpStatusCode} of the HTTP response that caused the error.
	 * */
	public get statusCode()
	{
		return this.#_statusCode;
	}
}

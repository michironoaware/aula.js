import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";
import { ProblemDetails } from "./Entities/Models/ProblemDetails.js";

/**
 * Represents an error that occurred during a request to the Aula REST API.
 * */
export class AulaRestError extends Error
{
	readonly #_problemDetails: ProblemDetails;
	readonly #_innerError: HttpRequestError | null;

	/**
	 * Initializes a new instance of {@link AulaRestError}.
	 * @param message The message of the error.
	 * @param problemDetails The problem details of the request error.
	 * @param innerError the {@link HttpRequestError} related to the error.
	 * @package
	 * */
	public constructor(
		message: string,
		problemDetails: ProblemDetails,
		innerError?: HttpRequestError)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(message, "string");
		ThrowHelper.TypeError.throwIfNotType(problemDetails, ProblemDetails);
		ThrowHelper.TypeError.throwIfNotAnyType(innerError, HttpRequestError, "undefined");

		let errorString = null;
		if (problemDetails.errors.size > 0)
		{
			errorString =
				Array.from(problemDetails.errors)
				     .map(v =>
				     {
					     const propertyName = v[0];
					     const propertyErrors = v[1];
					     return ` -- "${propertyName}":\n ---- ${propertyErrors.join("\n - - - ")}`;
				     }).join("\n");
		}

		super(`\n${message}` +
		      `\n - Title: ${problemDetails.title}` +
		      `\n - Detail: ${problemDetails.detail}` +
		      `\n - Status: ${problemDetails.status}` +
		      (errorString != null ? `\n - Errors:\n${errorString}` : ""));

		this.#_problemDetails = problemDetails;
		this.#_innerError = innerError ?? null;
	}

	/**
	 * Gets the problem details of the error.
	 * */
	public get problemDetails()
	{
		return this.#_problemDetails;
	}

	/**
	 * Gets the inner error.
	 * */
	public get innerError()
	{
		return this.#_innerError;
	}
}

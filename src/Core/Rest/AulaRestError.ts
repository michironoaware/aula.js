﻿import { ThrowHelper } from "../../Common/ThrowHelper";
import { HttpRequestError } from "../../Common/Http/HttpRequestError";
import { ProblemDetails } from "./Entities/Models/ProblemDetails";

/**
 * Represents an error that occurred during a request to the Aula REST API.
 * */
export class AulaRestError extends Error
{
	readonly #_problemDetails: ProblemDetails | null;
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
		problemDetails?: ProblemDetails,
		innerError?: HttpRequestError)
	{
		ThrowHelper.TypeError.throwIfNotType(message, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(problemDetails, ProblemDetails, "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(innerError, HttpRequestError, "undefined");

		if (problemDetails)
		{
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

		}
		else
		{
			super(message);
		}

		this.#_problemDetails = problemDetails ?? null;
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

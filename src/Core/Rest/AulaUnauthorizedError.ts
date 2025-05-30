import { AulaRestError } from "./AulaRestError";
import { SealedClassError } from "../../Common/SealedClassError";
import { HttpRequestError } from "../../Common/Http/HttpRequestError";
import { ProblemDetails } from "./Entities/Models/ProblemDetails";

/**
 * The error that occurs when the provided authorization credentials are missing or invalid.
 * */
export class AulaUnauthorizedError extends AulaRestError
{
	/**
	 * Initializes a new instance of {@link AulaUnauthorizedError}.
	 * @param problemDetails The problem details of the request error.
	 * @param innerError the {@link HttpRequestError} related to the error.
	 * @package
	 * */
	public constructor(
		problemDetails?: ProblemDetails,
		innerError?: HttpRequestError)
	{
		super("The 'Authorization' header was missing or invalid", problemDetails, innerError);
		SealedClassError.throwIfNotEqual(AulaUnauthorizedError, new.target);
	}
}

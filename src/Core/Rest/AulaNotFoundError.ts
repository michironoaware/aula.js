import { AulaRestError } from "./AulaRestError.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";
import { ProblemDetails } from "./Entities/Models/ProblemDetails.js";

/**
 * The error that occurs when a requested resource does not exist.
 * */
export class AulaNotFoundError extends AulaRestError
{
	/**
	 * Initializes a new instance of {@link AulaNotFoundError}.
	 * @param problemDetails The problem details of the request error.
	 * @param innerError the {@link HttpRequestError} related to the error.
	 * @package
	 * */
	public constructor(
		problemDetails?: ProblemDetails,
		innerError?: HttpRequestError)
	{
		super("The resource doesn't exist", problemDetails, innerError);
		SealedClassError.throwIfNotEqual(AulaNotFoundError, new.target);
	}
}

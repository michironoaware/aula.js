import { AulaRestError } from "./AulaRestError.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";
import { ProblemDetails } from "./Entities/Models/ProblemDetails.js";

/**
 * The error that occurs when an operation could not be completed because there was no permission to access the resource.
 * */
export class AulaForbiddenError extends AulaRestError
{
	/**
	 * Initializes a new instance of {@link AulaForbiddenError}.
	 * @param problemDetails The problem details of the request error.
	 * @param innerError the {@link HttpRequestError} related to the error.
	 * @package
	 * */
	public constructor(
		problemDetails?: ProblemDetails,
		innerError?: HttpRequestError)
	{
		super("You did not have permission to access the resource", problemDetails, innerError);
		SealedClassError.throwIfNotEqual(AulaForbiddenError, new.target);
	}
}

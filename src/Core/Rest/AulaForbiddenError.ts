import { AulaRestError } from "./AulaRestError";
import { SealedClassError } from "../../Common/SealedClassError";
import { HttpRequestError } from "../../Common/Http/HttpRequestError";
import { ProblemDetails } from "./Entities/Models/ProblemDetails";

/**
 * The error that occurs when a user is authenticated but not authorized
 * to perform the requested action.
 * The error may occur for one of several reasons:
 * - The user lacks the required permissions for the resource or action.
 * - The user's email has not been confirmed.
 * - The user’s account type is not permitted to access the resource.
 * - The user is banned from the service.
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

import { AulaRestError } from "./AulaRestError";
import { SealedClassError } from "../../Common/SealedClassError";
import { HttpRequestError } from "../../Common/Http/HttpRequestError";
import { ProblemDetails } from "./Entities/Models/ProblemDetails";

/**
 * The error that occurs when a specified resource could not be found.
 * This may happen either because the resource itself does not exist,
 * or because a referenced resource within the request is missing or invalid.
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

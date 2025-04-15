import { AulaRestError } from "./AulaRestError.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";
import { ProblemDetails } from "./Entities/Models/ProblemDetails.js";

/**
 * The error that occurs when a request was improperly formatted, or the server couldn't understand it.
 * @sealed
 * */
export class AulaBadRequestError extends AulaRestError
{
	/**
	 * Initializes a new instance of {@link AulaBadRequestError}.
	 * @param problemDetails The problem details of the request error.
	 * @param innerError the {@link HttpRequestError} related to the error.
	 * @package
	 * */
	public constructor(
		problemDetails: ProblemDetails,
		innerError?: HttpRequestError)
	{
		super("The request was improperly formatted, or the server couldn't understand it", problemDetails, innerError);
		SealedClassError.throwIfNotEqual(AulaBadRequestError, new.target);
	}
}

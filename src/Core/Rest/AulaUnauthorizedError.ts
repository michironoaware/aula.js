import { AulaRestError } from "./AulaRestError.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";
import { ProblemDetails } from "./Entities/Models/ProblemDetails.js";

export class AulaUnauthorizedError extends AulaRestError
{
	public constructor(
		problemDetails: ProblemDetails,
		innerError?: HttpRequestError)
	{
		super("The 'Authorization' header was missing or invalid", problemDetails, innerError);
		SealedClassError.throwIfNotEqual(AulaUnauthorizedError, new.target);
	}
}

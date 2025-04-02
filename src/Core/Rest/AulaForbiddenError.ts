import { AulaRestError } from "./AulaRestError.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";
import { ProblemDetails } from "./Entities/Models/ProblemDetails.js";

export class AulaForbiddenError extends AulaRestError
{
	public constructor(
		problemDetails: ProblemDetails,
		innerError?: HttpRequestError)
	{
		super(`You did not have permission to access the resource`, problemDetails, innerError);
		SealedClassError.throwIfNotEqual(AulaForbiddenError, new.target);
	}
}

import { AulaRestError } from "./AulaRestError.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";
import { ProblemDetails } from "./Entities/Models/ProblemDetails.js";

export class AulaNotFoundError extends AulaRestError
{
	public constructor(
		problemDetails: ProblemDetails,
		innerError?: HttpRequestError)
	{
		super(`The resource doesn't exist`, problemDetails, innerError);
		SealedClassError.throwIfNotEqual(AulaNotFoundError, new.target);
	}
}

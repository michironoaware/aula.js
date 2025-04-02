import { AulaRestError } from "./AulaRestError.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";
import { ProblemDetails } from "./Entities/Models/ProblemDetails.js";

export class AulaBadRequestError extends AulaRestError
{
	public constructor(
		problemDetails: ProblemDetails,
		innerError?: HttpRequestError)
	{
		super(`The request was improperly formatted, or the server couldn't understand it`, problemDetails, innerError);
		SealedClassError.throwIfNotEqual(AulaBadRequestError, new.target);
	}
}

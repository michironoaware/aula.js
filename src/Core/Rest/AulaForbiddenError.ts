import { AulaRestError } from "./AulaRestError.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode.js";

export class AulaForbiddenError extends AulaRestError
{
	public constructor(
		title: string,
		detail: string,
		status: HttpStatusCode,
		innerError?: HttpRequestError)
	{
		super(`You did not have permission to access the resource`, title, detail, status, innerError);
		SealedClassError.throwIfNotEqual(AulaForbiddenError, new.target);
	}
}

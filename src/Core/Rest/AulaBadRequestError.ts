import { AulaRestError } from "./AulaRestError.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode.js";

export class AulaBadRequestError extends AulaRestError
{
	public constructor(
		title: string,
		detail: string,
		status: HttpStatusCode,
		innerError: HttpRequestError | null = null)
	{
		super(`The request was improperly formatted, or the server couldn't understand it`, title, detail, status, innerError);
		SealedClassError.throwIfNotEqual(AulaBadRequestError, new.target);
	}
}

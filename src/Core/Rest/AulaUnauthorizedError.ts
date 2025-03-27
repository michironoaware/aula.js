import { AulaRestError } from "./AulaRestError.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode.js";

export class AulaUnauthorizedError extends AulaRestError
{
	public constructor(
		title: string,
		detail: string,
		status: HttpStatusCode,
		innerError?: HttpRequestError)
	{
		super(`The 'Authorization' header was missing or invalid`, title, detail, status, innerError);
		SealedClassError.throwIfNotEqual(AulaUnauthorizedError, new.target);
	}
}

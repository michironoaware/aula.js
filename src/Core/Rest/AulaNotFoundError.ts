import { AulaRestError } from "./AulaRestError.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode.js";

export class AulaNotFoundError extends AulaRestError
{
	public constructor(
		title: string,
		detail: string,
		status: HttpStatusCode,
		innerError: HttpRequestError | null = null)
	{
		super(`The resource doesn't exist`, title, detail, status, innerError);
		SealedClassError.throwIfNotEqual(AulaNotFoundError, new.target);
	}
}

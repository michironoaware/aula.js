import { AulaRestError } from "./AulaRestError.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";

export class AulaUnauthorizedError extends AulaRestError
{
	public constructor(content: string | null, innerError: HttpRequestError | null = null)
	{
		super(`The 'Authorization' header was missing or invalid.`, content, innerError);
		SealedClassError.throwIfNotEqual(AulaUnauthorizedError, new.target);
	}
}

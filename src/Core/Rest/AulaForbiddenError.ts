import { AulaRestError } from "./AulaRestError.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";

export class AulaForbiddenError extends AulaRestError
{
	public constructor(content: string | null, innerError: HttpRequestError | null = null)
	{
		super(`You did not have permission to the resource.`, content, innerError);
		SealedClassError.throwIfNotEqual(AulaForbiddenError, new.target);
	}
}

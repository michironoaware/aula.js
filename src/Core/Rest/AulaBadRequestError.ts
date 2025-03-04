import { AulaRestError } from "../AulaRestError.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";

export class AulaBadRequestError extends AulaRestError
{
	public constructor(content: string | null, innerError: HttpRequestError | null = null)
	{
		super(`The request was improperly formatted, or the server couldn't understand it.`, content, innerError);
		SealedClassError.throwIfNotEqual(AulaBadRequestError, new.target);
	}
}

import { AulaRestError } from "../AulaRestError.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";

export class AulaNotFoundError extends AulaRestError
{
	public constructor(content: string | null, innerError: HttpRequestError | null)
	{
		super(`The resource doesn't exist.`, content, innerError);
		SealedClassError.throwIfNotEqual(AulaNotFoundError, new.target);
	}
}

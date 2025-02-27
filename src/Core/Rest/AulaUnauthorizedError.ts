import {AulaError} from "../AulaError.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";
import {SealedClassError} from "../../Common/SealedClassError.js";

export class AulaUnauthorizedError extends AulaError
{
	public constructor(content: string | null)
	{
		super(`The 'Authorization' header was missing or invalid.`, content);
		SealedClassError.throwIfNotEqual(AulaUnauthorizedError, new.target);
		ThrowHelper.TypeError.throwIfNotAnyType(content, "string", "null");
	}
}

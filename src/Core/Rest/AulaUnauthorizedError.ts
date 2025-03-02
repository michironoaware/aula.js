import {AulaRestError} from "../AulaRestError.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";
import {SealedClassError} from "../../Common/SealedClassError.js";

export class AulaUnauthorizedError extends AulaRestError
{
	public constructor(content: string | null)
	{
		super(`The 'Authorization' header was missing or invalid.`, content);
		SealedClassError.throwIfNotEqual(AulaUnauthorizedError, new.target);
		ThrowHelper.TypeError.throwIfNotAnyType(content, "string", "null");
	}
}

import {AulaRestError} from "../AulaRestError.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";
import {SealedClassError} from "../../Common/SealedClassError.js";

export class AulaForbiddenError extends AulaRestError
{
	public constructor(content: string | null)
	{
		super(`You did not have permission to the resource.`, content);
		SealedClassError.throwIfNotEqual(AulaForbiddenError, new.target);
		ThrowHelper.TypeError.throwIfNotAnyType(content, "string", "null");
	}
}

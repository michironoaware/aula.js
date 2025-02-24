import {AulaError} from "../AulaError.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";

export class AulaForbiddenError extends AulaError
{
	public constructor(content: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(content, "string", "null");
		super(`You did not have permission to the resource.`, content);
	}
}

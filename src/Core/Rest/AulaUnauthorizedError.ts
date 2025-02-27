import {AulaError} from "../AulaError.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";

export class AulaUnauthorizedError extends AulaError
{
	public constructor(content: string | null)
	{
		super(`The 'Authorization' header was missing or invalid.`, content);
		ThrowHelper.TypeError.throwIfNotAnyType(content, "string", "null");
	}
}

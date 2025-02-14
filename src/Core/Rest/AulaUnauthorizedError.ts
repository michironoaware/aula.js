import AulaError from "../AulaError.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";

export class AulaUnauthorizedError extends AulaError
{
	public constructor(content: string | null)
	{
		ThrowHelper.TypeError.throwIfNotNullAndType(content, "string");
		super(`The 'Authorization' header was missing or invalid.`, content);
	}
}

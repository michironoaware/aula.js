import AulaError from "../AulaError.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";

export class AulaNotFoundError extends AulaError
{
	public constructor(content: string | null)
	{
		ThrowHelper.TypeError.throwIfNotNullAndType(content, "string");
		super(`The resource doesn't exist.`, content);
	}
}

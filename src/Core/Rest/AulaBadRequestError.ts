import AulaError from "../AulaError.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";

export class AulaBadRequestError extends AulaError
{
	public constructor(content: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(content, "string", "null");
		super(`The request was improperly formatted, or the server couldn't understand it.`, content);
	}
}
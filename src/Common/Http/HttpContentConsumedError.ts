import { InvalidOperationError } from "../InvalidOperationError.js";
import { SealedClassError } from "../SealedClassError.js";

export class HttpContentConsumedError extends InvalidOperationError
{
	public constructor()
	{
		super("Cannot consume already read content.");
		SealedClassError.throwIfNotEqual(HttpContentConsumedError, new.target);
	}
}

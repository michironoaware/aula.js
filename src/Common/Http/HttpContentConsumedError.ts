import { InvalidOperationError } from "../InvalidOperationError.js";
import { SealedClassError } from "../SealedClassError.js";
import { ThrowHelper } from "../ThrowHelper.js";

export class HttpContentConsumedError extends InvalidOperationError
{
	public constructor()
	{
		super("Cannot consume already read content.");
		SealedClassError.throwIfNotEqual(HttpContentConsumedError, new.target);
	}

	public static throwIf(condition: boolean): asserts condition is false
	{
		ThrowHelper.TypeError.throwIfNotType(condition, "boolean");

		if (condition)
		{
			throw new HttpContentConsumedError();
		}
	}
}

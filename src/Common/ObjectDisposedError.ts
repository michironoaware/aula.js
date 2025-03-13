import { ThrowHelper } from "./ThrowHelper.js";
import { SealedClassError } from "./SealedClassError.js";
import { InvalidOperationError } from "./InvalidOperationError.js";

export class ObjectDisposedError extends InvalidOperationError
{
	public constructor()
	{
		super("Cannot access a disposed object");
		SealedClassError.throwIfNotEqual(ObjectDisposedError, new.target);
	}

	public static throwIf(condition: boolean): asserts condition is false
	{
		ThrowHelper.TypeError.throwIfNotType(condition, "boolean");

		if (condition)
		{
			throw new ObjectDisposedError();
		}
	}
}

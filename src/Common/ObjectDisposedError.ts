import {ThrowHelper} from "./ThrowHelper.js";
import {SealedClassError} from "./SealedClassError.js";

export class ObjectDisposedError extends Error
{
	public constructor()
	{
		super("Cannot access a disposed object.");
		SealedClassError.throwIfNotEqual(ObjectDisposedError, new.target);
	}

	public static throwIf(condition: boolean)
	{
		ThrowHelper.TypeError.throwIfNotType(condition, "boolean");

		if (condition)
		{
			throw new ObjectDisposedError();
		}
	}
}

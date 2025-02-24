import {ThrowHelper} from "./ThrowHelper.js";

export class ObjectDisposedError extends Error
{
	public constructor()
	{
		super("Cannot access a disposed object.");
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

import {ThrowHelper} from "./ThrowHelper.js";

export class SealedClassError extends Error
{
	public constructor()
	{
		super("This class extends a sealed class and cannot be instantiated.");
		SealedClassError.throwIfNotEqual(SealedClassError, new.target);
	}

	public static throwIfNotEqual(type: Function, target: Function)
	{
		ThrowHelper.TypeError.throwIfNotType(type, "function");
		ThrowHelper.TypeError.throwIfNotType(target, "function");

		if (target !== type)
		{
			throw new SealedClassError();
		}
	}
}

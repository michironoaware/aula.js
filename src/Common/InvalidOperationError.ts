import {SealedClassError} from "./SealedClassError.js";
import {ThrowHelper} from "./ThrowHelper.js";

export class InvalidOperationError extends Error
{
	public constructor(message: string)
	{
		super(message);
		SealedClassError.throwIfNotEqual(InvalidOperationError, new.target);
		ThrowHelper.TypeError.throwIfNotType(message, "string");
	}
}

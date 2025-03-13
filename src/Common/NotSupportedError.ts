import { SealedClassError } from "./SealedClassError.js";
import { ThrowHelper } from "./ThrowHelper.js";

export class NotSupportedError extends Error
{
	public constructor(message: string = "The operation is not supported")
	{
		super(message);
		SealedClassError.throwIfNotEqual(NotSupportedError, new.target);
		ThrowHelper.TypeError.throwIfNotType(message, "string");
	}
}

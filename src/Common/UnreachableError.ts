import {SealedClassError} from "./SealedClassError.js";
import {InvalidOperationError} from "./InvalidOperationError.js";

export class UnreachableError extends Error
{
	public constructor(message: string)
	{
		super(message);
		SealedClassError.throwIfNotEqual(InvalidOperationError, new.target);
	}
}

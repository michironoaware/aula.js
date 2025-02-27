import {SealedClassError} from "./SealedClassError.js";

export class InvalidOperationError extends Error
{
	public constructor(message: string)
	{
		super(message);
		SealedClassError.throwIfNotEqual(InvalidOperationError, new.target);
	}
}

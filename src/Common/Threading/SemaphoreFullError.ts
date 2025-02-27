import {SealedClassError} from "../SealedClassError.js";

export class SemaphoreFullError extends Error
{
	public constructor()
	{
		super("The semaphore count is already at the maximum value.");
		SealedClassError.throwIfNotEqual(SemaphoreFullError, new.target);
	}
}

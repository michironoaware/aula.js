import { SealedClassError } from "./SealedClassError.js";

/**
 * @sealed
 * */
export class NotImplementedError extends Error
{
	public constructor()
	{
		super("Not implemented");
		SealedClassError.throwIfNotEqual(NotImplementedError, new.target);
	}
}

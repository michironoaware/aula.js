import { SealedClassError } from "./SealedClassError.js";

export class NotImplementedError extends Error
{
	public constructor()
	{
		super("Not implemented");
		SealedClassError.throwIfNotEqual(NotImplementedError, new.target);
	}
}

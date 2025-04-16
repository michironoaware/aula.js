import { SealedClassError } from "./SealedClassError.js";

/**
 * The exception that is thrown when a requested method or operation is not implemented.
 * @sealed
 * @package
 * */
export class NotImplementedError extends Error
{
	/**
	 * Initializes a new instance of {@link NotImplementedError}.
	 * */
	public constructor()
	{
		super("Not implemented");
		SealedClassError.throwIfNotEqual(NotImplementedError, new.target);
	}
}

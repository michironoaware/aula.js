import { SealedClassError } from "./SealedClassError";

/**
 * The exception that is thrown when a requested method or operation is not implemented.
 * @sealed
 * */
export class NotImplementedError extends Error
{
	/**
	 * Initializes a new instance of {@link NotImplementedError}.
	 * @package
	 * */
	public constructor()
	{
		super("Not implemented");
		SealedClassError.throwIfNotEqual(NotImplementedError, new.target);
	}
}

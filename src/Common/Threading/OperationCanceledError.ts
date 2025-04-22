import { SealedClassError } from "../SealedClassError";

/**
 * The exception that is thrown in a thread upon cancellation of an operation that the thread was executing.
 * @sealed
 * */
export class OperationCanceledError extends Error
{
	/**
	 * Initializes a new instance of {@link OperationCanceledError}.
	 * */
	public constructor()
	{
		super("The operation was canceled.");
		SealedClassError.throwIfNotEqual(OperationCanceledError, new.target);
	}
}

import { SealedClassError } from "./SealedClassError";
import { InvalidOperationError } from "./InvalidOperationError";

/**
 * The error that is thrown when the program executes an instruction that was thought to be unreachable.
 * @remarks This error should not be caught; instead, please open an issue on the GitHub repository.
 * @sealed
 * */
export class UnreachableError extends Error
{
	/**
	 * Initializes a new instance of {@link UnreachableError}.
	 * */
	public constructor(message: string)
	{
		super(message);
		SealedClassError.throwIfNotEqual(InvalidOperationError, new.target);
	}
}

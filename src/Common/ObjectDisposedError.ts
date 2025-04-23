import { ThrowHelper } from "./ThrowHelper";
import { SealedClassError } from "./SealedClassError";
import { InvalidOperationError } from "./InvalidOperationError";

/**
 * The exception that is thrown when an operation is performed on a disposed object.
 * @sealed
 * */
export class ObjectDisposedError extends InvalidOperationError
{
	/**
	 * Initializes a new instance of {@link ObjectDisposedError}.
	 * @package
	 * */
	public constructor()
	{
		super("Cannot access a disposed object");
		SealedClassError.throwIfNotEqual(ObjectDisposedError, new.target);
	}

	/**
	 * Throws an {@link ObjectDisposedError} if the specified condition is true.
	 * @param condition The condition to evaluate.
	 * @package
	 * */
	public static throwIf(condition: boolean): asserts condition is false
	{
		ThrowHelper.TypeError.throwIfNotType(condition, "boolean");

		if (condition)
		{
			throw new ObjectDisposedError();
		}
	}
}

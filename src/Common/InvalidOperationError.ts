import { ThrowHelper } from "./ThrowHelper.js";

/**
 * The exception that is thrown when a method call is invalid for the object's current state.
 * */
export class InvalidOperationError extends Error
{
	/**
	 * Initializes a new instance of {@link InvalidOperationError}.
	 * @param message The error message.
	 * */
	public constructor(message: string)
	{
		super(message);
		ThrowHelper.TypeError.throwIfNotType(message, "string");
	}

	/**
	 * Throws an {@link InvalidOperationError} if the specified condition is true.
	 * @param condition The condition to evaluate.
	 * @param message The message of the error.
	 * */
	public static throwIf(condition: boolean, message: string): asserts condition is false
	{
		ThrowHelper.TypeError.throwIfNotType(condition, "boolean");
		ThrowHelper.TypeError.throwIfNotType(message, "string");

		if (condition)
		{
			throw new InvalidOperationError(message);
		}
	}
}

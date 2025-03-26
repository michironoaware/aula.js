import { ThrowHelper } from "./ThrowHelper.js";

export class InvalidOperationError extends Error
{
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

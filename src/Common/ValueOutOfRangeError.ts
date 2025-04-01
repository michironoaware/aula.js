import { SealedClassError } from "./SealedClassError.js";
import { ThrowHelper } from "./ThrowHelper.js";

export class ValueOutOfRangeError extends Error
{
	public constructor(message: string)
	{
		super(message);
		SealedClassError.throwIfNotEqual(ValueOutOfRangeError, new.target);
		ThrowHelper.TypeError.throwIfNotType(message, "string");
	}

	public static throwIfEqual(value: number, other: number)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		ThrowHelper.TypeError.throwIfNotType(other, "number");

		if (value === other)
		{
			throw new ValueOutOfRangeError("Value is equal to other");
		}
	}

	public static throwIfGreaterThan(value: number, other: number)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		ThrowHelper.TypeError.throwIfNotType(other, "number");

		if (value > other)
		{
			throw new ValueOutOfRangeError("value is greater than other");
		}
	}

	public static throwIfGreaterThanOrEqual(value: number, other: number)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		ThrowHelper.TypeError.throwIfNotType(other, "number");

		if (value >= other)
		{
			throw new ValueOutOfRangeError("value is greater than or equal to other");
		}
	}

	public static throwIfLessThan(value: number, other: number)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		ThrowHelper.TypeError.throwIfNotType(other, "number");

		if (value < other)
		{
			throw new ValueOutOfRangeError("value is less than other");
		}
	}

	public static throwIfLessThanOrEqual(value: number, other: number)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		ThrowHelper.TypeError.throwIfNotType(other, "number");

		if (value <= other)
		{
			throw new ValueOutOfRangeError("value is less than or equal to other");
		}
	}

	public static throwIfNotEqual(value: number, other: number)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		ThrowHelper.TypeError.throwIfNotType(other, "number");

		if (value !== other)
		{
			throw new ValueOutOfRangeError("value is not equal to other");
		}
	}
}

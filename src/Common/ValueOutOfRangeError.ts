import { SealedClassError } from "./SealedClassError.js";
import { ThrowHelper } from "./ThrowHelper.js";

/**
 * Thrown when a value is out of the expected range.
 * @sealed
 * */
export class ValueOutOfRangeError extends Error
{
	/**
	 * Initializes a new instance of {@link ValueOutOfRangeError}.
	 * */
	public constructor(message: string)
	{
		super(message);
		SealedClassError.throwIfNotEqual(ValueOutOfRangeError, new.target);
		ThrowHelper.TypeError.throwIfNotType(message, "string");
	}

	/**
	 * Throws a {@link ValueOutOfRangeError} if {@link value} is equal to {@link other}.
	 * @param value The value to compare against {@link other}.
	 * @param other The other value.
	 * */
	public static throwIfEqual(value: number, other: number)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		ThrowHelper.TypeError.throwIfNotType(other, "number");

		if (value === other)
		{
			throw new ValueOutOfRangeError("Value is equal to other");
		}
	}

	/**
	 * Throws a {@link ValueOutOfRangeError} if {@link value} is greater than {@link other}.
	 * @param value The value to compare against {@link other}.
	 * @param other The other value.
	 * */
	public static throwIfGreaterThan(value: number, other: number)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		ThrowHelper.TypeError.throwIfNotType(other, "number");

		if (value > other)
		{
			throw new ValueOutOfRangeError("value is greater than other");
		}
	}

	/**
	 * Throws a {@link ValueOutOfRangeError} if {@link value} is greater than or equal to {@link other}.
	 * @param value The value to compare against {@link other}.
	 * @param other The other value.
	 * */
	public static throwIfGreaterThanOrEqual(value: number, other: number)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		ThrowHelper.TypeError.throwIfNotType(other, "number");

		if (value >= other)
		{
			throw new ValueOutOfRangeError("value is greater than or equal to other");
		}
	}

	/**
	 * Throws a {@link ValueOutOfRangeError} if {@link value} is less than {@link other}.
	 * @param value The value to compare against {@link other}.
	 * @param other The other value.
	 * */
	public static throwIfLessThan(value: number, other: number)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		ThrowHelper.TypeError.throwIfNotType(other, "number");

		if (value < other)
		{
			throw new ValueOutOfRangeError("value is less than other");
		}
	}

	/**
	 * Throws a {@link ValueOutOfRangeError} if {@link value} is less than or equal to {@link other}.
	 * @param value The value to compare against {@link other}.
	 * @param other The other value.
	 * */
	public static throwIfLessThanOrEqual(value: number, other: number)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		ThrowHelper.TypeError.throwIfNotType(other, "number");

		if (value <= other)
		{
			throw new ValueOutOfRangeError("value is less than or equal to other");
		}
	}

	/**
	 * Throws a {@link ValueOutOfRangeError} if {@link value} is not equal to {@link other}.
	 * @param value The value to compare against {@link other}.
	 * @param other The other value.
	 * */
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

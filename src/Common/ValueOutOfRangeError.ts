import {SealedClassError} from "./SealedClassError.js";
import {ThrowHelper} from "./ThrowHelper.js";

export class ValueOutOfRangeError extends Error
{
	public constructor(message: string, paramName?: string)
	{
		super(`Parameter name: "${paramName}".` + message ? ` ${message}` : "");
		SealedClassError.throwIfNotEqual(ValueOutOfRangeError, new.target);
		ThrowHelper.TypeError.throwIfNotType(message, "string");
		ThrowHelper.TypeError.throwIfNotType(paramName, "string");
	}

	public static throwIfEqual(value: number, other: number, paramName?: string)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		ThrowHelper.TypeError.throwIfNotType(other, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(paramName, "string", "undefined");

		if (value === other)
		{
			throw new ValueOutOfRangeError((paramName ? `Parameter name: "${paramName}". ` : "") + "value is equal to other.");
		}
	}

	public static throwIfGreaterThan(value: number, other: number, paramName?: string)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		ThrowHelper.TypeError.throwIfNotType(other, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(paramName, "string", "undefined");

		if (value > other)
		{
			throw new ValueOutOfRangeError((paramName ? `Parameter name: "${paramName}". ` : "") + "value is greater than other.");
		}
	}

	public static throwIfGreaterThanOrEqual(value: number, other: number, paramName?: string)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		ThrowHelper.TypeError.throwIfNotType(other, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(paramName, "string", "undefined");

		if (value >= other)
		{
			throw new ValueOutOfRangeError((paramName ? `Parameter name: "${paramName}". ` : "") + "value is greater than or equal to other.");
		}
	}

	public static throwIfLessThan(value: number, other: number, paramName?: string)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		ThrowHelper.TypeError.throwIfNotType(other, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(paramName, "string", "undefined");

		if (value < other)
		{
			throw new ValueOutOfRangeError((paramName ? `Parameter name: "${paramName}". ` : "") + "value is less than other.");
		}
	}

	public static throwIfLessThanOrEqual(value: number, other: number, paramName?: string)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		ThrowHelper.TypeError.throwIfNotType(other, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(paramName, "string", "undefined");

		if (value <= other)
		{
			throw new ValueOutOfRangeError((paramName ? `Parameter name: "${paramName}". ` : "") + "value is less than or equal to other.");
		}
	}

	public static throwIfNotEqual(value: number, other: number, paramName?: string)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		ThrowHelper.TypeError.throwIfNotType(other, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(paramName, "string", "undefined");

		if (value !== other)
		{
			throw new ValueOutOfRangeError((paramName ? `Parameter name: "${paramName}". ` : "") + "value is not equal to other.");
		}
	}
}

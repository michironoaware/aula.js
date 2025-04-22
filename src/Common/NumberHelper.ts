import { ThrowHelper } from "./ThrowHelper";

export namespace NumberHelper
{
	export function getInt32BitFields(value: number): number[]
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");

		const bitFields = [];

		for (let i = 0; i < 32; i++)
		{
			const bit = 1 << i;
			if ((value & bit) === bit)
			{
				bitFields.push(bit);
			}
		}

		return bitFields;
	}

	export function getInt64BitFields(value: bigint): bigint[]
	{
		ThrowHelper.TypeError.throwIfNotType(value, "bigint");

		const bitFields = [];

		for (let i = 0; i < 64; i++)
		{
			const bit = 1n << BigInt(i);
			if ((value & bit) === bit)
			{
				bitFields.push(bit);
			}
		}

		return bitFields;
	}
}

import { ThrowHelper } from "./ThrowHelper.js";

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
}

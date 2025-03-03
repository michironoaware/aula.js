export namespace TypeHelper
{
	export function isType(object: unknown, type: any): boolean
	{
		// Check whether typeof of the object is the same as the type string.
		const isTypeOf = typeof type === "string" && typeof object === type;

		// For checking whether an enum value is inside the defined range
		// Doesn't work with flag enums
		const isPropertyOf = typeof type === "object" && !!type[object as any];

		// For checking whether an enum flag is inside the defined range
		let isEnumFlagOf = isPropertyOf;
		if (!isEnumFlagOf && typeof type === "object" && typeof object === "number")
		{
			let valuesSum = 0;
			for (const property in type)
			{
				const value = type[property];
				if (typeof value !== "number")
				{
					continue;
				}

				valuesSum += value;
			}

			if (valuesSum >= object)
			{
				isEnumFlagOf = true;
			}
		}

		// Check if the object is an instance of the specified class
		const isInstanceOf = typeof type === "function" && object instanceof type;

		return isTypeOf || isInstanceOf || isPropertyOf || isEnumFlagOf;
	}

	export function isAnyType(object: unknown, ...types: any[]): boolean
	{
		return types.find(t => isType(object, t)) !== undefined;
	}
}

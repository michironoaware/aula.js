export namespace TypeHelper
{
	export function isType(object: unknown, type: any): boolean
	{
		// Check whether typeof of the object is the same as the type string.
		const isTypeOf = typeof type === "string" && typeof object === type;

		// For checking whether an enum value is inside the defined range
		// Doesn't work with flag enums
		const isPropertyOf = typeof type === "object" && type[object as any];

		// Check if the object is an instance of the specified class
		const isInstanceOf = typeof type !== "string" && typeof type !== "object" && object instanceof type;

		return isTypeOf || isInstanceOf || isPropertyOf;
	}

	export function isAnyType(object: unknown, ...types: any[]): boolean
	{
		for (const type of types)
		{
			if (isType(object, type))
			{
				return true;
			}
		}

		return false;
	}
}

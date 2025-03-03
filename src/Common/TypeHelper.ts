export namespace TypeHelper
{
	export function isType<T extends TypeResolvable>(object: unknown, type: T): object is ResolvedType<T>
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

	export function isAnyType<T extends TypeResolvable[]>(object: unknown, ...types: T): object is ResolvedType<T[number]>
	{
		return types.find(t => isType(object, t)) !== undefined;
	}

	export type TypeResolvable =
		"string" |
		"number" |
		"bigint" |
		"boolean" |
		"symbol" |
		"undefined" |
		"object" |
		"function" |
		(abstract new (...args: any[]) => any) |
		Record<string, string | number>;

	export type ResolvedType<T> =
		T extends "string" ? string
		: T extends "number" ? number
		: T extends "bigint" ? bigint
		: T extends "boolean" ? boolean
		: T extends "symbol" ? symbol
		: T extends "undefined" ? undefined
		: T extends "object" ? object
		: T extends "function" ? Function
		: T extends abstract new (...args: any[]) => infer R ? R
		: T extends Record<string, string | number> ? T[keyof T]
		: never;
}

export namespace TypeHelper
{
	export function isNullable<T>(obj: T): obj is Extract<T, null | undefined>
	{
		return obj === null || obj === undefined;
	}

	export function isType<T extends TypeResolvable>(obj: unknown, type: T): obj is ResolvedType<T>
	{
		if (typeof type === "string")
		{
			return (
				// Check whether typeof of the object is the same as the type string.
				typeof obj === type ||

				// Check if object is null for type "null"
				(type === "null" && obj === null) ||

				// Check if object is either null or undefined for type "nullable"
				(type === "nullable" && isNullable(obj)) ||

				// Check if object is iterable for type "iterable"
				(type === "iterable" && (obj as any)[Symbol.iterator] !== undefined) ||

				// Check if object is array for type "array"
				(type === "array" && Array.isArray(obj))
			);
		}

		return (
			// Check if the object is an instance of the specified class
			(typeof type === "function" && obj instanceof type) ||

			// For checking whether a numeric value is defined in the enum's members
			// does not work as expected with flag enums
			(typeof type === "object" && Object.values(type).includes(obj as string | number))
		);
	}

	export function isAnyType<
		T1 extends TypeResolvable,
		T2 extends TypeResolvable,
		T3 extends TypeResolvable>(object: unknown, type1: T1, type2: T2, type3?: T3)
		: object is ResolvedType<T1> | ResolvedType<T2> | ResolvedType<T3>
	{
		return TypeHelper.isType(object, type1) ||
		       TypeHelper.isType(object, type2) ||
		       (!TypeHelper.isNullable(type3) && TypeHelper.isType(object, type3));
	}

	export function isTypeArray<T extends TypeResolvable>(object: unknown, type: T): object is ResolvedType<T>[]
	{
		if (!isType(object, "array"))
		{
			return false;
		}

		for (const item of object)
		{
			if (!isType(item, type))
			{
				return false;
			}
		}

		return true;
	}

	// @formatter:off
	export type TypeResolvable =
		"string" |
		"number" |
		"bigint" |
		"boolean" |
		"symbol" |
		"undefined" |
		"object" |
		"function" |
		"null" |
		"iterable" |
		"array" |
		"nullable" |
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
	: T extends "null" ? null
	: T extends "iterable" ? Iterable<unknown>
	: T extends "array" ? readonly unknown[]
	: T extends "nullable" ? null | undefined
	: T extends abstract new (...args: any[]) => infer R ? R
	: T extends Record<string, string | number> ? T[keyof T]
	: never;
	// @formatter:on
}

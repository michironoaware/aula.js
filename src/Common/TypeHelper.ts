export namespace TypeHelper
{
	export function isNullable<T>(object: T): object is Extract<T, null | undefined>
	{
		return object === null || object === undefined;
	}

	export function isType<T extends TypeResolvable>(object: unknown, type: T): object is ResolvedType<T>
	{
		if (typeof type === "string")
		{
			return (
				// Check whether typeof of the object is the same as the type string.
				typeof object === type ||

				// Check if object is null for type "null"
				(type === "null" && object === null) ||

				// Check if object is either null or undefined for type "nullable"
				(type === "nullable" && isNullable(object)) ||

				// Check if object is iterable for type "iterable"
				(type === "iterable" && (object as any)[Symbol.iterator] !== undefined) ||

				// Check if object is array for type "array"
				(type === "array" && Array.isArray(object))
			);
		}

		return (
			// Check if the object is an instance of the specified class
			(typeof type === "function" && object instanceof type) ||

			// For checking whether a numeric value is defined in the enum's members
			// does not work with flag enums
			(typeof type === "object" && type[object as any] !== undefined)
		);
	}

	export function isAnyType<T extends TypeResolvable[]>(object: unknown, ...types: T): object is ResolvedType<T[number]>
	{
		return types.find(t => isType(object, t)) !== undefined;
	}

	export function isTypeArray<T extends TypeResolvable>(object: unknown, type: T): object is ResolvedType<T>[]
	{
		if (!isType(object, "array"))
		{
			return false;
		}

		for (let item of object)
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

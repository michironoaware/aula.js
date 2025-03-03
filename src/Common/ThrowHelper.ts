import {TypeHelper} from "./TypeHelper.js";

const TypeErrorConstructor = TypeError;
const ReferenceErrorConstructor = ReferenceError;

export namespace ThrowHelper
{
	export namespace TypeError
	{
		import TypeResolvable = TypeHelper.TypeResolvable;

		export function throwIfNull<T>(object: T): asserts object is NonNullable<T>
		{
			if (object === null || object === undefined)
			{
				throw new TypeErrorConstructor(`Object is null.`);
			}
		}

		export function throwIfNotType<T extends TypeResolvable>(object: unknown, type: T): asserts object is ResolvedType<T>
		{
			if (!TypeHelper.isType(object, type))
			{
				throw new TypeErrorConstructor("Object is not an instance of the type expected.");
			}
		}

		export function throwIfNotAnyType<T extends TypeResolvable[]>(object: unknown, ...type: T)
			: asserts object is ResolvedType<T[number]>
		{
			const isAnyType = type.find(t => TypeHelper.isType(object, t)) !== undefined;
			if (!isAnyType)
			{
				throw new TypeErrorConstructor("Object is not an instance of the type expected.");
			}
		}

		type ResolvedType<T> =
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

	export namespace ReferenceError
	{
		export function throwIfUndefined<T>(object: T): asserts object is Exclude<T, undefined>
		{
			if (object === undefined)
			{
				throw new ReferenceErrorConstructor("Value is undefined.");
			}
		}
	}
}

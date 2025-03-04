import {TypeHelper} from "./TypeHelper.js";

const TypeErrorConstructor = TypeError;
const ReferenceErrorConstructor = ReferenceError;

export namespace ThrowHelper
{
	export namespace TypeError
	{
		import TypeResolvable = TypeHelper.TypeResolvable;
		import ResolvedType = TypeHelper.ResolvedType;

		export function throwIfNullable<T>(object: T): asserts object is NonNullable<T>
		{
			if (TypeHelper.isNullable(object))
			{
				throw new TypeErrorConstructor(`Object is nullable.`);
			}
		}

		export function throwIfNotType<T extends TypeResolvable>(object: unknown, type: T): asserts object is ResolvedType<T>
		{
			if (!TypeHelper.isType(object, type))
			{
				throw new TypeErrorConstructor("Object is not an instance of the type expected.");
			}
		}

		export function throwIfNotAnyType<T extends TypeResolvable[]>(object: unknown, ...types: T)
			: asserts object is ResolvedType<T[number]>
		{
			const isAnyType = types.find(t => TypeHelper.isType(object, t)) !== undefined;
			if (!isAnyType)
			{
				throw new TypeErrorConstructor("Object is not an instance of the type expected.");
			}
		}
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

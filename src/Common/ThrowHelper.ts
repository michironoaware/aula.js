import { TypeHelper } from "./TypeHelper.js";

const TypeErrorConstructor = TypeError;
const ReferenceErrorConstructor = ReferenceError;

/**
 * @package
 * */
export namespace ThrowHelper
{
	export namespace TypeError
	{
		import TypeResolvable = TypeHelper.TypeResolvable;
		import ResolvedType = TypeHelper.ResolvedType;

		export function throwIf(condition: boolean, message: string): asserts condition is false
		{
			if (condition)
			{
				throw new TypeErrorConstructor(message);
			}
		}

		export function throwIfNullable<T>(object: T): asserts object is NonNullable<T>
		{
			if (TypeHelper.isNullable(object))
			{
				throw new TypeErrorConstructor("Object is nullable");
			}
		}

		export function throwIfNotNullable<T>(object: T): asserts object is Extract<T, null | undefined>
		{
			if (!TypeHelper.isNullable(object))
			{
				throw new TypeErrorConstructor("Object is not nullable");
			}
		}

		export function throwIfUndefined<T>(object: T): asserts object is Extract<T, undefined>
		{
			if (object === undefined)
			{
				throw new TypeErrorConstructor("Object is undefined");
			}
		}

		export function throwIfType<TObject, TType extends TypeResolvable>(object: TObject, type: TType)
			: asserts object is Exclude<TObject, ResolvedType<TType>>
		{
			if (TypeHelper.isType(object, type))
			{
				throw new TypeErrorConstructor("Object cannot be an instance of the specified type");
			}
		}

		export function throwIfNotType<T extends TypeResolvable>(object: unknown, type: T): asserts object is ResolvedType<T>
		{
			if (!TypeHelper.isType(object, type))
			{
				throw new TypeErrorConstructor("Object is not an instance of the type expected");
			}
		}

		export function throwIfNotAnyType<
			T1 extends TypeResolvable,
			T2 extends TypeResolvable,
			T3 extends TypeResolvable>(object: unknown, type1: T1, type2: T2, type3?: T3)
			: asserts object is ResolvedType<T1> | ResolvedType<T2> | ResolvedType<T3>
		{
			if (!TypeHelper.isAnyType(object, type1, type2, type3))
			{
				throw new TypeErrorConstructor("Object is not an instance of the type expected");
			}
		}

		export function throwIfNotTypeArray<T extends TypeResolvable>(object: unknown, type: T): asserts object is ResolvedType<T>[]
		{
			if (!TypeHelper.isTypeArray(object, type))
			{
				throw new TypeErrorConstructor("Object is not an array or an item is of an unexpected type");
			}
		}
	}

	export namespace ReferenceError
	{
		export function throwIfUndefined<T>(object: T): asserts object is Exclude<T, undefined>
		{
			if (object === undefined)
			{
				throw new ReferenceErrorConstructor("Value is undefined");
			}
		}
	}
}

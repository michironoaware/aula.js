import { TypeHelper } from "./TypeHelper";

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

		export function throwIfNullable<T>(obj: T): asserts obj is NonNullable<T>
		{
			if (TypeHelper.isNullable(obj))
			{
				throw new TypeErrorConstructor("Object is nullable");
			}
		}

		export function throwIfNotNullable<T>(obj: T): asserts obj is Extract<T, null | undefined>
		{
			if (!TypeHelper.isNullable(obj))
			{
				throw new TypeErrorConstructor("Object is not nullable");
			}
		}

		export function throwIfUndefined<T>(obj: T): asserts obj is Extract<T, undefined>
		{
			if (obj === undefined)
			{
				throw new TypeErrorConstructor("Object is undefined");
			}
		}

		export function throwIfType<TObject, TType extends TypeResolvable>(obj: TObject, type: TType)
			: asserts obj is Exclude<TObject, ResolvedType<TType>>
		{
			if (TypeHelper.isType(obj, type))
			{
				throw new TypeErrorConstructor("Object cannot be an instance of the specified type");
			}
		}

		export function throwIfNotType<T extends TypeResolvable>(obj: unknown, type: T): asserts obj is ResolvedType<T>
		{
			if (!TypeHelper.isType(obj, type))
			{
				throw new TypeErrorConstructor("Object is not an instance of the type expected");
			}
		}

		export function throwIfNotAnyType<
			T1 extends TypeResolvable,
			T2 extends TypeResolvable,
			T3 extends TypeResolvable>(obj: unknown, type1: T1, type2: T2, type3?: T3)
			: asserts obj is ResolvedType<T1> | ResolvedType<T2> | ResolvedType<T3>
		{
			if (!TypeHelper.isAnyType(obj, type1, type2, type3))
			{
				throw new TypeErrorConstructor("Object is not an instance of the type expected");
			}
		}

		export function throwIfNotTypeArray<T extends TypeResolvable>(obj: unknown, type: T): asserts obj is ResolvedType<T>[]
		{
			if (!TypeHelper.isTypeArray(obj, type))
			{
				throw new TypeErrorConstructor("Object is not an array or an item is of an unexpected type");
			}
		}
	}

	export namespace ReferenceError
	{
		export function throwIfUndefined<T>(obj: T): asserts obj is Exclude<T, undefined>
		{
			if (obj === undefined)
			{
				throw new ReferenceErrorConstructor("Value is undefined");
			}
		}
	}
}

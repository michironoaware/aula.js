import { TypeHelper } from "./TypeHelper.js";

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

		export function throwIfNotAnyType<T extends TypeResolvable[]>(object: unknown, ...types: T)
			: asserts object is ResolvedType<T[number]>
		{
			const isAnyType = types.find(t => TypeHelper.isType(object, t)) !== undefined;
			if (!isAnyType)
			{
				throw new TypeErrorConstructor("Object is not an instance of the type expected");
			}
		}

		export function throwIfNotTypeArray<T extends TypeResolvable>(object: unknown[], type: T): asserts object is ResolvedType<T>[]
		{
			if (!TypeHelper.isTypeArray(object, type))
			{
				throw new TypeErrorConstructor("Object is not an array or an item is of an unexpected type");
			}
		}

		export function throwIfNotTypesArray<T extends TypeResolvable[]>(object: unknown[], ...types: T)
			: asserts object is ResolvedType<T[number]>[]
		{
			throwIfNotType(object, "array");
			for (const item of object)
			{
				throwIfNotAnyType(item, ...types);
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

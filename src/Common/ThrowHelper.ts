import {TypeHelper} from "./TypeHelper.js";

const TypeErrorConstructor = TypeError;
const ReferenceErrorConstructor = ReferenceError;

export namespace ThrowHelper
{
	export namespace TypeError
	{
		export function throwIfNull<T>(object: T): asserts object is NonNullable<T>
		{
			if (object === null || object === undefined)
			{
				throw new TypeErrorConstructor(`Object is null.`);
			}
		}

		export function throwIfNotType<T>(object: T, type: any)
		{
			if (!TypeHelper.isType(object, type))
			{
				throw new TypeErrorConstructor("Object is not an instance of the type expected.");
			}
		}

		export function throwIfNotAnyType<T>(object: T, ...type: any[])
		{
			const isAnyType = type.find(t => TypeHelper.isType(object, t)) != null;
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

import {CheckHelper} from "./CheckHelper.js";

const TypeErrorConstructor = TypeError;

export namespace ThrowHelper
{
	export namespace TypeError
	{
		export function throwIfNull<T>(object: T): asserts object is T
		{
			if (object == null)
			{
				throw new TypeErrorConstructor(`Object is null.`);
			}
		}

		export function throwIfNotType<T>(object: T, type: any): asserts object is T
		{
			if (!CheckHelper.isType(object, type))
			{
				throw new TypeErrorConstructor("Object is not an instance of the type expected.");
			}
		}

		export function throwIfNotAnyType<T>(object: T, type: any[]): asserts object is T
		{
			const isAnyType = type.find(t => CheckHelper.isType(object, t)) != null;
			if (!isAnyType)
			{
				throw new TypeErrorConstructor("Object is not an instance of the type expected.");
			}
		}

		export function throwIfNotNullAndType<T>(object: T, type: any): asserts object is T
		{
			if (object != null &&
				!CheckHelper.isType(object, type))
			{
				throw new TypeErrorConstructor("Object is not an instance of the type expected.");
			}
		}
	}
}

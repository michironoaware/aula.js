import { ThrowHelper } from "./ThrowHelper";

export namespace ArrayHelper
{
	export function asArray<T>(iterable: Iterable<T>)
	{
		ThrowHelper.TypeError.throwIfNotType(iterable, "iterable");
		return Array.isArray(iterable) ? iterable as T[] : [ ...iterable ];
	}
}

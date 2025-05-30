import { ThrowHelper } from "./ThrowHelper";

export namespace ArrayHelper
{
	export function asArray<T>(iterable: Iterable<T>)
	{
		ThrowHelper.TypeError.throwIfNotType(iterable, "iterable");
		return Array.isArray(iterable) ? iterable as T[] : [ ...iterable ];
	}

	export function distinct<T>(array: T[])
	{
		return array.filter((v, i, arr) => arr.indexOf(v) === i);
	}
}

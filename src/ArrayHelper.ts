import { ThrowHelper } from "./Common/ThrowHelper.js";

export namespace ArrayHelper
{
	export function asArray<T>(iterable: Iterable<T>)
	{
		ThrowHelper.TypeError.throwIfNotType(iterable, "iterable");
		return Array.isArray(iterable) ? iterable : [ ...iterable ];
	}
}

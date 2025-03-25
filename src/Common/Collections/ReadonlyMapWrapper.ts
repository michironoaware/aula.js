import { SealedClassError } from "../SealedClassError.js";
import { ThrowHelper } from "../ThrowHelper.js";

export class ReadonlyMapWrapper<TKey, TValue> implements ReadonlyMap<TKey, TValue>
{
	readonly #_underlyingMap: ReadonlyMap<TKey, TValue>;

	public constructor(underlyingMap: ReadonlyMap<TKey, TValue>)
	{
		SealedClassError.throwIfNotEqual(ReadonlyMapWrapper, new.target);
		ThrowHelper.TypeError.throwIfNullable(underlyingMap);

		this.#_underlyingMap = underlyingMap;
	}

	public get size()
	{
		return this.#_underlyingMap.size;
	}

	public forEach(callbackfn: (value: TValue, key: TKey, map: ReadonlyMap<TKey, TValue>) => void, thisArg?: any)
	{
		this.#_underlyingMap.forEach((value, key) => callbackfn(value, key, this), thisArg);
	}

	public get(key: TKey)
	{
		return this.#_underlyingMap.get(key);
	}

	public has(key: TKey)
	{
		return this.#_underlyingMap.has(key);
	}

	public entries()
	{
		return this.#_underlyingMap.entries();
	}

	public keys()
	{
		return this.#_underlyingMap.keys();
	}

	public values()
	{
		return this.#_underlyingMap.values();
	}

	public [Symbol.iterator]()
	{
		return this.#_underlyingMap.entries();
	}

}

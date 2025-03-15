import { SealedClassError } from "../SealedClassError.js";
import { ThrowHelper } from "../ThrowHelper.js";

export class ReadonlyMapWrapper<K, V> implements ReadonlyMap<K, V>
{
	readonly #_underlyingMap: ReadonlyMap<K, V>;

	public constructor(underlyingMap: ReadonlyMap<K, V>)
	{
		SealedClassError.throwIfNotEqual(ReadonlyMapWrapper, new.target);
		ThrowHelper.TypeError.throwIfNullable(underlyingMap);

		this.#_underlyingMap = underlyingMap;
	}

	public get size()
	{
		return this.#_underlyingMap.size;
	}

	public forEach(callbackfn: (value: V, key: K, map: ReadonlyMap<K, V>) => void, thisArg?: any)
	{
		this.#_underlyingMap.forEach((value, key) => callbackfn(value, key, this), thisArg);
	}

	public get(key: K)
	{
		return this.#_underlyingMap.get(key);
	}

	public has(key: K)
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

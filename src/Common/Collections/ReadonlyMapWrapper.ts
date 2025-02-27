import {SealedClassError} from "../SealedClassError.js";

export class ReadonlyMapWrapper<K, V> implements ReadonlyMap<K, V>
{
	readonly #underlyingMap: ReadonlyMap<K, V>;

	public constructor(underlyingMap: ReadonlyMap<K, V>)
	{
		SealedClassError.throwIfNotEqual(ReadonlyMapWrapper, new.target);

		this.#underlyingMap = underlyingMap;
	}

	public get size()
	{
		return this.#underlyingMap.size;
	}

	public forEach(callbackfn: (value: V, key: K, map: ReadonlyMap<K, V>) => void, thisArg?: any): void
	{
		this.#underlyingMap.forEach((value, key) => callbackfn(value, key, this), thisArg);
	}

	public get(key: K)
	{
		return this.#underlyingMap.get(key);
	}

	public has(key: K)
	{
		return this.#underlyingMap.has(key);
	}

	public entries()
	{
		return this.#underlyingMap.entries();
	}

	public keys()
	{
		return this.#underlyingMap.keys();
	}

	public values()
	{
		return this.#underlyingMap.values();
	}

	public [Symbol.iterator]()
	{
		return this.#underlyingMap.entries();
	}

}

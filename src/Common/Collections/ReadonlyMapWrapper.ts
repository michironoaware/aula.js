import { SealedClassError } from "../SealedClassError.js";
import { ThrowHelper } from "../ThrowHelper.js";

/**
 * Represents a read-only collection of key/value pairs.
 * */
export class ReadonlyMapWrapper<TKey, TValue> implements ReadonlyMap<TKey, TValue>
{
	readonly #_underlyingMap: ReadonlyMap<TKey, TValue>;

	/**
	 * Initializes a new instance that it's wrapped around the specified map.
	 * */
	public constructor(underlyingMap: ReadonlyMap<TKey, TValue>)
	{
		SealedClassError.throwIfNotEqual(ReadonlyMapWrapper, new.target);
		ThrowHelper.TypeError.throwIfNullable(underlyingMap);

		this.#_underlyingMap = underlyingMap;
	}

	/**
	 * Gets the number of entries in the map.
	 * */
	public get size()
	{
		return this.#_underlyingMap.size;
	}

	/**
	 * Executes the provided function for each entry in the map.
	 * */
	public forEach(callbackfn: (value: TValue, key: TKey, map: ReadonlyMap<TKey, TValue>) => void, thisArg?: any)
	{
		this.#_underlyingMap.forEach((value, key) => callbackfn(value, key, this), thisArg);
	}

	/**
	 * Gets an item with the specified {@link key}.
	 * */
	public get(key: TKey)
	{
		return this.#_underlyingMap.get(key);
	}

	/**
	 * Gets whether an entry with the specified {@link key} exists in the map.
	 * */
	public has(key: TKey)
	{
		return this.#_underlyingMap.has(key);
	}

	/**
	 * Gets an iterator for the collection entries.
	 * */
	public entries()
	{
		return this.#_underlyingMap.entries();
	}

	/**
	 * Gets an iterator for the collection keys.
	 * */
	public keys()
	{
		return this.#_underlyingMap.keys();
	}

	/**
	 * Gets an iterator for the collection values.
	 * */
	public values()
	{
		return this.#_underlyingMap.values();
	}

	/**
	 * Gets an iterator for the collection entries.
	 * */
	public [Symbol.iterator]()
	{
		return this.#_underlyingMap.entries();
	}

}

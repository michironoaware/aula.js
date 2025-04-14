import { SealedClassError } from "../SealedClassError.js";
import { ThrowHelper } from "../ThrowHelper.js";

/**
 * Represents a read-only collection of key/value pairs.
 * */
export class ReadonlyDictionary<TKey, TValue>
{
	static #s_empty = new ReadonlyDictionary(new Map());

	readonly #_underlyingMap: ReadonlyMap<TKey, TValue>;

	/**
	 * Initializes a new instance that it's wrapped around the specified map.
	 * @param underlyingMap The underlying map.
	 * */
	public constructor(underlyingMap: ReadonlyMap<TKey, TValue>)
	{
		SealedClassError.throwIfNotEqual(ReadonlyDictionary, new.target);
		ThrowHelper.TypeError.throwIfNullable(underlyingMap);

		this.#_underlyingMap = underlyingMap;
	}

	public static get empty()
	{
		return this.#s_empty;
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
	public values(): Iterator<TValue>
	{
		return this.#_underlyingMap.values();
	}

	public [Symbol.iterator](): Iterator<[ TKey, TValue ]>
	{
		return this.#_underlyingMap.entries();
	}

}

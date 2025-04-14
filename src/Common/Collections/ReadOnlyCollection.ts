import { SealedClassError } from "../SealedClassError.js";
import { ThrowHelper } from "../ThrowHelper.js";

/**
 * Represents a read-only collection of values.
 * @sealed
 * */
export class ReadOnlyCollection<T> implements Iterable<T>
{
	readonly #_underlyingCollection: readonly T[];

	/**
	 * Initializes a new instance that it's wrapped around the specified collection.
	 * @param underlyingArray The underlying collection.
	 * */
	public constructor(underlyingArray: readonly T[])
	{
		SealedClassError.throwIfNotEqual(ReadOnlyCollection, new.target);
		ThrowHelper.TypeError.throwIfNullable(underlyingArray);

		this.#_underlyingCollection = underlyingArray;
	}

	/**
	 * Gets the length of the collection.
	 * */
	get length()
	{
		return this.#_underlyingCollection.length;
	}

	/**
	 * Returns the index of the first occurrence of a value in the collection.
	 * @param searchElement The value to locate in the collection.
	 * @param fromIndex The collection index at which to begin the search.
	 *                  If omitted, the search starts at index 0.
	 * */
	public indexOf(searchElement: T, fromIndex?: number)
	{
		return this.#_underlyingCollection.indexOf(searchElement, fromIndex);
	}

	/**
	 * Returns the index of the last occurrence of a specified value in the collection.
	 * @param searchElement The value to locate in the collection.
	 * @param fromIndex The collection index at which to begin the search.
	 *                  If omitted, the search starts at the last index in the collection.
	 */
	public lastIndexOf(searchElement: T, fromIndex?: number)
	{
		return this.#_underlyingCollection.lastIndexOf(searchElement, fromIndex);
	}

	/**
	 * @returns An iterable of values in the collection.
	 * */
	public values(): Iterator<T>
	{
		return this.#_underlyingCollection.values();
	}

	[Symbol.iterator](): Iterator<T>
	{
		return this.values();
	}
}

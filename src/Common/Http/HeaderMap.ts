import { ThrowHelper } from "../ThrowHelper";
import { SealedClassError } from "../SealedClassError";
import { InvalidOperationError } from "../InvalidOperationError";

/**
 * Represents a wrapper for the request and response headers.
 * @sealed
 * */
export class HeaderMap implements ReadonlyMap<string, string[]>
{
	readonly #_underlyingMap: Map<string, string[]>;

	/**
	 * Initializes a new instance that it's wrapped around the specified map.
	 * @param headers The underlying key/value pair structure.
	 * */
	public constructor(headers?: ReadonlyMap<string, string[]>)
	{
		SealedClassError.throwIfNotEqual(HeaderMap, new.target);
		ThrowHelper.TypeError.throwIfNotAnyType(headers, "object", "undefined");

		this.#_underlyingMap = new Map(headers);
	}

	/**
	 * Gets the number of headers in the map.
	 * */
	public get size()
	{
		return this.#_underlyingMap.size;
	}

	/**
	 * Executes the provided function for each header in the map.
	 * */
	public forEach(callbackfn: (value: string[], key: string, map: ReadonlyMap<string, string[]>) => void, thisArg?: any)
	{
		this.#_underlyingMap.forEach((value, key) => callbackfn(value, key, this), thisArg);
	}

	/**
	 * Gets a header with the specified {@link name}.
	 * */
	public get(name: string)
	{
		return this.#_underlyingMap.get(name.toLowerCase());
	}

	/**
	 * Gets whether a header with the specified {@link name} exists in the map.
	 * */
	public has(name: string)
	{
		return this.#_underlyingMap.has(name.toLowerCase());
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

	/**
	 * Adds the provided {@link value} to the specified header.
	 * @param name The name of the header.
	 * @param value The value to add.
	 * @throws TypeError If {@link value} contains a header separator character (";").
	 * @throws InvalidOperationError If a header with the same {@link name} is already defined.
	 * */
	public add(name: string, value: string)
	{
		ThrowHelper.TypeError.throwIfNotType(name, "string");
		ThrowHelper.TypeError.throwIfNotType(value, "string");
		ThrowHelper.TypeError.throwIf(value.includes(";"), "The value string cannot include a header separator (\";\").");

		const lowerCaseName = name.toLowerCase();
		if (this.#_underlyingMap.has(lowerCaseName))
		{
			throw new InvalidOperationError(`The key ${name} is already defined in the map`);
		}

		this.#_underlyingMap.set(lowerCaseName, [ value ]);
	}

	/**
	 * Adds or appends the provided {@link value} to the specified header.
	 * @param name The name of the header.
	 * @param value The value to add/append.
	 * @throws TypeError If {@link value} contains a header separator character (";").
	 * */
	public append(name: string, value: string)
	{
		ThrowHelper.TypeError.throwIfNotType(name, "string");
		ThrowHelper.TypeError.throwIfNotType(value, "string");
		ThrowHelper.TypeError.throwIf(value.includes(";"), "The value string cannot include a header separator character (\";\").");

		const lowerCaseName = name.toLowerCase();

		let values = this.#_underlyingMap.get(lowerCaseName);
		if (values === undefined)
		{
			values = [];
			this.#_underlyingMap.set(lowerCaseName, values);
		}

		values.push(value);
	}

	/**
	 * Removes a header from the map.
	 * @param name The name of the header.
	 * */
	public delete(name: string)
	{
		ThrowHelper.TypeError.throwIfNotType(name, "string");
		this.#_underlyingMap.delete(name.toLowerCase());
	}
}

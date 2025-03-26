import { ThrowHelper } from "../ThrowHelper.js";
import { SealedClassError } from "../SealedClassError.js";

export class HeaderMap implements ReadonlyMap<string, string>
{
	readonly #_underlyingMap: Map<string, string>;

	public constructor(headers?: ReadonlyMap<string, string> | Headers)
	{
		SealedClassError.throwIfNotEqual(HeaderMap, new.target);
		ThrowHelper.TypeError.throwIfNotAnyType(headers, "object", "undefined");

		this.#_underlyingMap = new Map(headers);
	}

	public get size()
	{
		return this.#_underlyingMap.size;
	}

	public forEach(callbackfn: (value: string, key: string, map: ReadonlyMap<string, string>) => void, thisArg?: any)
	{
		this.#_underlyingMap.forEach((value, key) => callbackfn(value, key, this), thisArg);
	}

	public get(name: string)
	{
		return this.#_underlyingMap.get(name.toLowerCase());
	}

	public has(name: string)
	{
		return this.#_underlyingMap.has(name.toLowerCase());
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

	public append(name: string, value: string)
	{
		ThrowHelper.TypeError.throwIfNotType(name, "string");
		ThrowHelper.TypeError.throwIfNotType(value, "string");

		const nameInLowerCase = name.toLowerCase();

		let currentValue = this.#_underlyingMap.get(nameInLowerCase);
		let newValue = currentValue ? currentValue += `,${value}` : value;
		this.#_underlyingMap.set(nameInLowerCase, newValue);
	}

	public delete(name: string)
	{
		ThrowHelper.TypeError.throwIfNotType(name, "string");
		this.#_underlyingMap.delete(name);
	}
}

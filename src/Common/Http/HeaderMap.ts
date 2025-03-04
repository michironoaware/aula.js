import {ThrowHelper} from "../ThrowHelper.js";
import {SealedClassError} from "../SealedClassError.js";

export class HeaderMap implements ReadonlyMap<string, string>
{
	readonly #underlyingMap: Map<string, string>;

	public constructor(headers?: ReadonlyMap<string, string> | Headers)
	{
		SealedClassError.throwIfNotEqual(HeaderMap, new.target);
		ThrowHelper.TypeError.throwIfNotAnyType(headers, "object", "undefined");

		this.#underlyingMap = new Map(headers);
	}

	public get size()
	{
		return this.#underlyingMap.size;
	}

	public forEach(callbackfn: (value: string, key: string, map: ReadonlyMap<string, string>) => void, thisArg?: any)
	{
		this.#underlyingMap.forEach((value, key) => callbackfn(value, key, this), thisArg);
	}

	public get(key: string)
	{
		return this.#underlyingMap.get(key.toLowerCase());
	}

	public has(key: string)
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

	public append(name: string, value: string)
	{
		ThrowHelper.TypeError.throwIfNotType(name, "string");
		ThrowHelper.TypeError.throwIfNotType(value, "string");

		let currentValue = this.#underlyingMap.get(name.toLowerCase());
		let newValue = currentValue ? currentValue += `,${value}` : value;
		this.#underlyingMap.set(name.toLowerCase(), newValue);
	}

	public delete(name: string)
	{
		ThrowHelper.TypeError.throwIfNotType(name, "string");
		this.#underlyingMap.delete(name);
	}
}

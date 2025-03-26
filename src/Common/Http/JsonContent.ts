import { HttpContent } from "./HttpContent.js";
import { HeaderMap } from "./HeaderMap.js";
import { SealedClassError } from "../SealedClassError.js";
import { ObjectDisposedError } from "../ObjectDisposedError.js";
import { BigIntJsonReplacer } from "../Json/BigIntJsonReplacer.js";

export class JsonContent extends HttpContent
{
	readonly #_headers: HeaderMap;
	readonly #_string: string;
	#_disposed: boolean = false;

	public constructor(value: unknown)
	{
		super();
		SealedClassError.throwIfNotEqual(JsonContent, new.target);

		this.#_string = JSON.stringify(value, BigIntJsonReplacer);
		this.#_headers = new HeaderMap();
		this.#_headers.append("Content-Type", "application/json");
	}

	public get headers()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return this.#_headers;
	}

	public readAsStream()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return new Blob([ this.#_string ]).stream();
	}

	public readAsString()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return Promise.resolve(this.#_string);
	}

	public dispose()
	{
		this.#_disposed = true;
	}
}

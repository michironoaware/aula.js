import {HttpContent} from "./HttpContent.js";
import {ThrowHelper} from "../ThrowHelper.js";
import {HeaderMap} from "./HeaderMap.js";
import {SealedClassError} from "../SealedClassError.js";
import {ObjectDisposedError} from "../ObjectDisposedError.js";

export class JsonContent extends HttpContent
{
	readonly #headers: HeaderMap;
	readonly #string: string;
	#disposed: boolean = false;

	public constructor(value: unknown)
	{
		super();
		SealedClassError.throwIfNotEqual(JsonContent, new.target);

		this.#string = JSON.stringify(value);
		this.#headers = new HeaderMap();
		this.#headers.append("Content-Type", "application/json");
	}

	public get headers()
	{
		ObjectDisposedError.throwIf(this.#disposed);
		return this.#headers;
	}

	public get stream()
	{
		ObjectDisposedError.throwIf(this.#disposed);
		return new Blob([this.#string]).stream();
	}

	public readAsString()
	{
		ObjectDisposedError.throwIf(this.#disposed);
		return Promise.resolve(this.#string);
	}

	public dispose()
	{
		this.#disposed = true;
	}
}

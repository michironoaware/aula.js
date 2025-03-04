import { HttpContent } from "./HttpContent.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { HeaderMap } from "./HeaderMap.js";
import { SealedClassError } from "../SealedClassError.js";
import { ObjectDisposedError } from "../ObjectDisposedError.js";

export class StringContent extends HttpContent
{
	readonly #headers: HeaderMap;
	readonly #string: string;
	#disposed: boolean = false;

	public constructor(stringValue: string, contentType: string = "text/plain")
	{
		super();
		SealedClassError.throwIfNotEqual(StringContent, new.target);
		ThrowHelper.TypeError.throwIfNotType(stringValue, "string");
		ThrowHelper.TypeError.throwIfNotType(contentType, "string");

		this.#string = stringValue;
		this.#headers = new HeaderMap();
		this.#headers.append("Content-Type", contentType);
	}

	public get headers()
	{
		ObjectDisposedError.throwIf(this.#disposed);
		return this.#headers;
	}

	public get stream()
	{
		ObjectDisposedError.throwIf(this.#disposed);
		return new Blob([ this.#string ]).stream();
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

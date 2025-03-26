import { HttpContent } from "./HttpContent.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { HeaderMap } from "./HeaderMap.js";
import { ObjectDisposedError } from "../ObjectDisposedError.js";

export class StringContent extends HttpContent
{
	readonly #_headers: HeaderMap;
	readonly #_string: string;
	#_disposed: boolean = false;

	public constructor(stringValue: string, contentType: string = "text/plain")
	{
		super();
		ThrowHelper.TypeError.throwIfNotType(stringValue, "string");
		ThrowHelper.TypeError.throwIfNotType(contentType, "string");

		this.#_string = stringValue;
		this.#_headers = new HeaderMap();
		this.#_headers.append("Content-Type", contentType);
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

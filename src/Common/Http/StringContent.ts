import { HttpContent } from "./HttpContent.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { HeaderMap } from "./HeaderMap.js";
import { HttpContentConsumedError } from "./HttpContentConsumedError.js";

export class StringContent extends HttpContent
{
	readonly #_headers: HeaderMap;
	readonly #_string: string;
	#_read: boolean = false;

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
		return this.#_headers;
	}

	public readAsStream()
	{
		HttpContentConsumedError.throwIf(this.#_read);
		this.#_read = true;
		return new Blob([ this.#_string ]).stream();
	}

	public readAsString()
	{
		HttpContentConsumedError.throwIf(this.#_read);
		this.#_read = true;
		return Promise.resolve(this.#_string);
	}

	public dispose()
	{
	}
}

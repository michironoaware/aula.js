import {HttpContent} from "./HttpContent.js";
import {ThrowHelper} from "../ThrowHelper.js";
import {HeaderMap} from "./HeaderMap.js";

export class StringContent extends HttpContent
{
	readonly #headers: HeaderMap;
	readonly #string: string;

	public constructor(stringValue: string, contentType: string = "text/plain")
	{
		ThrowHelper.TypeError.throwIfNotType(stringValue, "string");
		ThrowHelper.TypeError.throwIfNotType(contentType, "string");
		super();

		this.#string = stringValue;
		this.#headers = new HeaderMap();
		this.#headers.append("Content-Type", contentType);
	}

	public get headers()
	{
		return this.#headers;
	}

	public get stream(): ReadableStream<Uint8Array>
	{
		return new Blob([this.#string]).stream();
	}

	public readAsString(): Promise<string>
	{
		return Promise.resolve(this.#string);
	}
}

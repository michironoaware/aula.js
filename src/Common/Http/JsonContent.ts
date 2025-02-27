import {HttpContent} from "./HttpContent.js";
import {ThrowHelper} from "../ThrowHelper.js";
import {HeaderMap} from "./HeaderMap.js";
import {SealedClassError} from "../SealedClassError.js";

export class JsonContent extends HttpContent
{
	readonly #headers: HeaderMap;
	readonly #string: string;

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

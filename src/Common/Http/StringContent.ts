import {HttpContent} from "./HttpContent.js";
import {ThrowHelper} from "../ThrowHelper.js";

export class StringContent extends HttpContent
{
	readonly #string: string;

	public constructor(stringValue: string)
	{
		ThrowHelper.TypeError.throwIfNotType(stringValue, "string");
		super();

		this.#string = stringValue;
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

import {HttpContent} from "./HttpContent.js";
import {ThrowHelper} from "../ThrowHelper.js";
import {HeaderMap} from "./HeaderMap.js";
import {SealedClassError} from "../SealedClassError.js";

export class StreamContent extends HttpContent
{
	readonly #stream: ReadableStream<Uint8Array>;
	readonly #headers: HeaderMap;

	public constructor(stream: ReadableStream<Uint8Array>, contentType = "application/octet-stream")
	{
		super();
		SealedClassError.throwIfNotEqual(StreamContent, new.target);
		ThrowHelper.TypeError.throwIfNotType(stream, ReadableStream<Uint8Array>);

		this.#stream = stream;

		this.#headers = new HeaderMap();
		this.#headers.append("Content-Type", contentType);
	}

	public get headers()
	{
		return this.#headers;
	}

	public get stream(): ReadableStream<Uint8Array>
	{
		return this.#stream;
	}

	public async readAsString(): Promise<string>
	{
		const reader = this.#stream.getReader();
		const decoder = new TextDecoder();

		let result = "";
		while (true)
		{
			const {done, value} = await reader.read();
			result += decoder.decode(value);

			if (done)
			{
				break;
			}
		}

		return result;
	}

}

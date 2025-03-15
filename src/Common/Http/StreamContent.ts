import { HttpContent } from "./HttpContent.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { HeaderMap } from "./HeaderMap.js";
import { SealedClassError } from "../SealedClassError.js";
import { ObjectDisposedError } from "../ObjectDisposedError.js";

export class StreamContent extends HttpContent
{
	readonly #_stream: ReadableStream<Uint8Array>;
	readonly #_headers: HeaderMap;
	#_disposed: boolean = false;

	public constructor(stream: ReadableStream<Uint8Array>, contentType = "application/octet-stream")
	{
		super();
		SealedClassError.throwIfNotEqual(StreamContent, new.target);
		ThrowHelper.TypeError.throwIfNotType(stream, ReadableStream<Uint8Array>);
		ThrowHelper.TypeError.throwIfNotType(contentType, "string");

		this.#_stream = stream;

		this.#_headers = new HeaderMap();
		this.#_headers.append("Content-Type", contentType);
	}

	public get headers()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return this.#_headers;
	}

	public get stream()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return this.#_stream;
	}

	public async readAsString()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		const reader = this.#_stream.getReader();
		const decoder = new TextDecoder();

		let result = "";
		while (true)
		{
			const { done, value } = await reader.read();
			result += decoder.decode(value);

			if (done)
			{
				break;
			}
		}

		return result;
	}

	public dispose()
	{
		this.#_disposed = true;
	}
}

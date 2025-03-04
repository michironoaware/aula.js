import { HttpContent } from "./HttpContent.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { HeaderMap } from "./HeaderMap.js";
import { SealedClassError } from "../SealedClassError.js";
import { ObjectDisposedError } from "../ObjectDisposedError.js";

export class StreamContent extends HttpContent
{
	readonly #stream: ReadableStream<Uint8Array>;
	readonly #headers: HeaderMap;
	#disposed: boolean = false;

	public constructor(stream: ReadableStream<Uint8Array>, contentType = "application/octet-stream")
	{
		super();
		SealedClassError.throwIfNotEqual(StreamContent, new.target);
		ThrowHelper.TypeError.throwIfNotType(stream, ReadableStream<Uint8Array>);
		ThrowHelper.TypeError.throwIfNotType(contentType, "string");

		this.#stream = stream;

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
		return this.#stream;
	}

	public async readAsString()
	{
		ObjectDisposedError.throwIf(this.#disposed);
		const reader = this.#stream.getReader();
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
		this.#disposed = true;
	}
}

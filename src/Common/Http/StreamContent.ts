import {HttpContent} from "./HttpContent.js";
import {ThrowHelper} from "../ThrowHelper.js";

export class StreamContent extends HttpContent
{
	readonly #stream: ReadableStream<Uint8Array>;

	public constructor(stream: ReadableStream<Uint8Array>)
	{
		super();
		ThrowHelper.TypeError.throwIfNull(stream);

		this.#stream = stream;
	}

	get stream(): ReadableStream<Uint8Array>
	{
		return this.#stream;
	}

	async readAsString(): Promise<string>
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

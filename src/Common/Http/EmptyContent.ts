import {HttpContent} from "./HttpContent.js";
import {HeaderMap} from "./HeaderMap.js";
import {SealedClassError} from "../SealedClassError.js";

export class EmptyContent extends HttpContent
{
	static #emptyStream: ReadableStream<Uint8Array> = new ReadableStream(
		{
			start(controller)
			{
				// Close the stream immediately
				controller.close();
			}
		});
	readonly #headers: HeaderMap = new HeaderMap();

	public constructor()
	{
		super();
		SealedClassError.throwIfNotEqual(EmptyContent, new.target);
	}

	public get headers()
	{
		return this.#headers;
	}

	public get stream(): ReadableStream<Uint8Array<ArrayBufferLike>>
	{
		return EmptyContent.#emptyStream;
	}

	public readAsString(): Promise<string>
	{
		return Promise.resolve("");
	}

}

import {HttpContent} from "./HttpContent.js";
import {HeaderMap} from "./HeaderMap.js";
import {SealedClassError} from "../SealedClassError.js";
import {ObjectDisposedError} from "../ObjectDisposedError.js";

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
	#disposed: boolean = false;

	public constructor()
	{
		super();
		SealedClassError.throwIfNotEqual(EmptyContent, new.target);
	}

	public get headers()
	{
		ObjectDisposedError.throwIf(this.#disposed);
		return this.#headers;
	}

	public get stream(): ReadableStream<Uint8Array<ArrayBufferLike>>
	{
		ObjectDisposedError.throwIf(this.#disposed);
		return EmptyContent.#emptyStream;
	}

	public readAsString(): Promise<string>
	{
		ObjectDisposedError.throwIf(this.#disposed);
		return Promise.resolve("");
	}

	public dispose()
	{
		this.#disposed = true;
	}
}

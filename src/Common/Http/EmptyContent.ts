import { HttpContent } from "./HttpContent.js";
import { HeaderMap } from "./HeaderMap.js";
import { SealedClassError } from "../SealedClassError.js";
import { ObjectDisposedError } from "../ObjectDisposedError.js";

export class EmptyContent extends HttpContent
{
	static #s_emptyStream: ReadableStream<Uint8Array> = new ReadableStream(
		{
			start(controller)
			{
				// Close the stream immediately
				controller.close();
			}
		});
	readonly #_headers: HeaderMap = new HeaderMap();
	#_disposed: boolean = false;

	public constructor()
	{
		super();
		SealedClassError.throwIfNotEqual(EmptyContent, new.target);
	}

	public get headers()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return this.#_headers;
	}

	public get stream()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return EmptyContent.#s_emptyStream;
	}

	public readAsString()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return Promise.resolve("");
	}

	public dispose()
	{
		this.#_disposed = true;
	}
}

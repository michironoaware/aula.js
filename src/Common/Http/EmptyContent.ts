import { HttpContent } from "./HttpContent.js";
import { HeaderMap } from "./HeaderMap.js";
import { SealedClassError } from "../SealedClassError.js";
import { ObjectDisposedError } from "../ObjectDisposedError.js";

/**
 * Represents an empty HTTP body without headers.
 * */
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
	static #s_emptyByteArray: Uint8Array = new Uint8Array(new ArrayBuffer());
	readonly #_headers: HeaderMap = new HeaderMap();
	#_disposed: boolean = false;

	/**
	 * Initializes a new instance of {@link EmptyContent}.
	 * */
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

	public readAsStream()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return Promise.resolve(EmptyContent.#s_emptyStream);
	}

	public readAsByteArray(): Promise<Uint8Array>
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return Promise.resolve(EmptyContent.#s_emptyByteArray);
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

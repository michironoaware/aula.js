import { HttpContent } from "./HttpContent.js";
import { HeaderMap } from "./HeaderMap.js";
import { SealedClassError } from "../SealedClassError.js";

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
		return this.#_headers;
	}

	public readAsStream()
	{
		return Promise.resolve(EmptyContent.#s_emptyStream);
	}

	public readAsByteArray(): Promise<Uint8Array>
	{
		return Promise.resolve(EmptyContent.#s_emptyByteArray);
	}

	public readAsString()
	{
		return Promise.resolve("");
	}

	public dispose()
	{
	}
}

import { HeaderMap } from "./HeaderMap.js";
import { HttpContent } from "./HttpContent.js";
import { ThrowHelper } from "../ThrowHelper.js";

/**
 * Provides HTTP content based on a byte array.
 * */
export class ByteArrayContent extends HttpContent
{
	static readonly #s_textDecoder: TextDecoder = new TextDecoder(undefined, { fatal: true });
	readonly #_headers: HeaderMap = new HeaderMap();
	readonly #_byteArray: Uint8Array;

	/**
	 * Initializes a new instance of {@link ByteArrayContent}
	 * @param bytes The byte array with the content.
	 * @param contentType The media type of the content as defined in {@link https://www.rfc-editor.org/rfc/rfc6838 RFC 6836}.
	 * */
	public constructor(bytes: Uint8Array, contentType: string = "application/octet-stream")
	{
		super();
		ThrowHelper.TypeError.throwIfNotType(bytes, Uint8Array);
		ThrowHelper.TypeError.throwIfNotType(contentType, "string");

		this.#_byteArray = bytes;
		this.#_headers.append("Content-Type", contentType);
	}

	public get headers()
	{
		return this.#_headers;
	}

	public readAsStream()
	{
		const byteArray = this.#_byteArray;
		const stream = new ReadableStream<Uint8Array>({
			
			start(controller)
			{
				controller.enqueue(byteArray);
				controller.close();
			},
		});

		return Promise.resolve(stream);
	}

	public readAsByteArray()
	{
		return Promise.resolve(this.#_byteArray);
	}

	public readAsString()
	{
		return Promise.resolve(ByteArrayContent.#s_textDecoder.decode(this.#_byteArray));
	}

	public dispose()
	{
	}
}

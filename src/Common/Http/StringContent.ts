import { HttpContent } from "./HttpContent.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { HeaderMap } from "./HeaderMap.js";

/**
 * Provides HTTP content based on text.
 * */
export class StringContent extends HttpContent
{
	readonly #_headers: HeaderMap = new HeaderMap();
	readonly #_string: string;

	/**
	 * Initializes a new instance of {@link StringContent}
	 * @param stringValue The text of the content.
	 * @param contentType The media type of the content as defined in {@link https://www.rfc-editor.org/rfc/rfc6838 RFC 6836}.
	 * */
	public constructor(stringValue: string, contentType: string = "text/plain")
	{
		super();
		ThrowHelper.TypeError.throwIfNotType(stringValue, "string");
		ThrowHelper.TypeError.throwIfNotType(contentType, "string");

		this.#_string = stringValue;
		this.#_headers.append("Content-Type", contentType);
	}

	public get headers()
	{
		return this.#_headers;
	}

	public readAsStream()
	{
		return new Blob([ this.#_string ]).stream();
	}

	public readAsString()
	{
		return Promise.resolve(this.#_string);
	}

	public dispose()
	{
	}
}

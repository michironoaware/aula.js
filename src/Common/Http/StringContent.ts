import { ByteArrayContent } from "./ByteArrayContent";

/**
 * Provides HTTP content based on text.
 * */
export class StringContent extends ByteArrayContent
{
	static readonly #s_textEncoder = new TextEncoder();

	/**
	 * Initializes a new instance of {@link StringContent}
	 * @param stringValue The text of the content.
	 * @param contentType The media type of the content as defined in {@link https://www.rfc-editor.org/rfc/rfc6838 RFC 6836}.
	 * */
	public constructor(stringValue: string, contentType: string = "text/plain")
	{
		super(StringContent.#s_textEncoder.encode(stringValue), contentType);
	}
}

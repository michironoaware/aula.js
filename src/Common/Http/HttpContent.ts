import { HeaderMap } from "./HeaderMap.js";
import { IDisposable } from "../IDisposable.js";
import { UInt8Stream } from "../IO/UInt8Stream.js";

/**
 * A base class representing an HTTP entity body and content headers.
 * */
export abstract class HttpContent implements IDisposable
{
	static #s_textDecoder = new TextDecoder(undefined, { fatal: true });

	/**
	 * Gets the HTTP content headers as defined in {@link https://www.rfc-editor.org/rfc/rfc2616 RFC 2616}.
	 * */
	public abstract get headers(): HeaderMap;

	/**
	 * Serializes the HTTP content and returns a stream that represents the content.
	 * */
	public abstract readAsStream(): Promise<ReadableStream<Uint8Array>>;

	/**
	 * Serialize the HTTP content to a byte array as an asynchronous operation.
	 * */
	public async readAsByteArray(): Promise<Uint8Array>
	{
		const contentReader = (await this.readAsStream()).getReader();
		const stringBytes = new UInt8Stream(256);
		const stringWriter = stringBytes.getWriter();

		while (true)
		{
			const { done, value } = await contentReader.read();
			await stringWriter.write(value);

			if (done)
			{
				await stringWriter.close();
				break;
			}
		}

		return stringBytes.written;
	}

	/**
	 * Serialize the HTTP content to a string as an asynchronous operation.
	 * */
	public async readAsString(): Promise<string>
	{
		return HttpContent.#s_textDecoder.decode(await this.readAsByteArray());
	}

	public abstract dispose(): void;
}

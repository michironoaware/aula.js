import {HttpContent} from "./HttpContent.js";

export class EmptyContent extends HttpContent
{
	static readonly #instance = new EmptyContent();
	static #emptyStream: ReadableStream<Uint8Array> = new ReadableStream(
		{
			start(controller)
			{
				// Close the stream immediately
				controller.close();
			}
		});

	public static get instance()
	{
		return EmptyContent.#instance;
	}

	private constructor()
	{
		super();
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

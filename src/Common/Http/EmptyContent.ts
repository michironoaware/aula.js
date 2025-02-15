import {HttpContent} from "./HttpContent.js";

export class EmptyContent extends HttpContent
{
	static readonly #instance = new EmptyContent();

	static get instance()
	{
		return EmptyContent.#instance;
	}

	static #emptyStream: ReadableStream<Uint8Array> = new ReadableStream(
		{
			start(controller)
			{
				// Close the stream immediately
				controller.close();
			}
		});

	private constructor()
	{
		super();
	}

	get stream(): ReadableStream<Uint8Array<ArrayBufferLike>>
	{
		return EmptyContent.#emptyStream;
	}

	readAsString(): Promise<string>
	{
		return Promise.resolve("");
	}

}

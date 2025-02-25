import {HttpContent} from "./HttpContent.js";

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


	public constructor()
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

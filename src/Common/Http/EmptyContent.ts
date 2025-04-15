import { HttpContent } from "./HttpContent.js";
import { HeaderMap } from "./HeaderMap.js";
import { SealedClassError } from "../SealedClassError.js";

/**
 * Represents an empty HTTP body without headers.
 * @sealed
 * */
export class EmptyContent extends HttpContent
{
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
		const stream = new ReadableStream({ start: (controller) => controller.close() });
		return Promise.resolve(stream);
	}

	public readAsByteArray(): Promise<Uint8Array>
	{
		return Promise.resolve(new Uint8Array(0));
	}

	public readAsString()
	{
		return Promise.resolve("");
	}

	public dispose()
	{
	}
}

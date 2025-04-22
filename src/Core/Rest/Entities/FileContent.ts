import { HttpContent } from "../../../Common/Http/HttpContent.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { IDisposable } from "../../../Common/IDisposable.js";
import { ObjectDisposedError } from "../../../Common/ObjectDisposedError.js";
import { RestClient } from "../RestClient.js";

/**
 * Represents the contents of a file hosted in Aula.
 * */
export class FileContent implements IDisposable
{
	readonly #_httpContent: HttpContent;
	readonly #_restClient: RestClient;
	#_disposed: boolean = false;

	/**
	 * Initializes a new instance of {@link FileContent}.
	 * @param httpContent The {@link HttpContent} holding the contents of the file.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(httpContent: HttpContent, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(FileContent, new.target);
		ThrowHelper.TypeError.throwIfNotType(httpContent, HttpContent);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

		this.#_httpContent = httpContent;
		this.#_restClient = restClient;
	}

	/**
	 * Gets the {@link RestClient} that initialized this instance.
	 * */
	public get restClient()
	{
		return this.#_restClient;
	}

	/**
	 * Reads the content as a stream.
	 * @returns A promise that resolves to a {@link ReadableStream}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 */
	public async readAsStream()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return await this.#_httpContent.readAsStream();
	}

	/**
	 * Reads the content as a byte array.
	 * @returns A promise that resolves to a {@link Uint8Array}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * */
	public async readAsByteArray()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return await this.#_httpContent.readAsByteArray();
	}

	public [Symbol.dispose]()
	{
		if (this.#_disposed)
		{
			return;
		}

		this.#_httpContent[Symbol.dispose]();
		this.#_disposed = true;
	}
}

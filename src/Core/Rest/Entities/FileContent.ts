import { HttpContent } from "../../../Common/Http/HttpContent";
import { ThrowHelper } from "../../../Common/ThrowHelper";
import { SealedClassError } from "../../../Common/SealedClassError";
import { ObjectDisposedError } from "../../../Common/ObjectDisposedError";
import { RestClient } from "../RestClient";
import { IAsyncDisposable } from "../../../Common/IAsyncDisposable";

/**
 * Represents the contents of a file hosted in Aula.
 * */
export class FileContent implements IAsyncDisposable
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
		//ThrowHelper.TypeError.throwIfNotType(restClient, RestClient); // Circular dependency problem

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

	public async [Symbol.asyncDispose]()
	{
		if (this.#_disposed)
		{
			return;
		}

		await this.#_httpContent[Symbol.asyncDispose]();
		this.#_disposed = true;
	}
}

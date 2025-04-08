import { HttpContent } from "../../../Common/Http/HttpContent.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { IDisposable } from "../../../Common/IDisposable.js";
import { ObjectDisposedError } from "../../../Common/ObjectDisposedError.js";

/**
 * Represents the contents of a file hosted in Aula.
 * */
export class FileContent implements IDisposable
{
	readonly #_httpContent: HttpContent;
	#_disposed: boolean = false;

	/**
	 * Initializes a new instance of {@link FileContent}.
	 * @param httpContent The {@link HttpContent} holding the contents of the file.
	 * @package
	 * */
	public constructor(httpContent: HttpContent)
	{
		SealedClassError.throwIfNotEqual(FileContent, new.target);
		ThrowHelper.TypeError.throwIfNotType(httpContent, HttpContent);

		this.#_httpContent = httpContent;
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

	public dispose()
	{
		if (this.#_disposed)
		{
			return;
		}

		this.#_httpContent.dispose();
		this.#_disposed = true;
	}
}

import { HttpContent } from "../../../Common/Http/HttpContent.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { IDisposable } from "../../../Common/IDisposable.js";
import { ObjectDisposedError } from "../../../Common/ObjectDisposedError.js";

export class FileContent implements IDisposable
{
	readonly #_httpContent: HttpContent;
	#_disposed: boolean = false;

	public constructor(httpContent: HttpContent)
	{
		SealedClassError.throwIfNotEqual(FileContent, new.target);
		ThrowHelper.TypeError.throwIfNotType(httpContent, HttpContent);

		this.#_httpContent = httpContent;
	}

	public async readAsStream()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return await this.#_httpContent.readAsStream();
	}

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

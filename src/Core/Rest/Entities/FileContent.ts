import { HttpContent } from "../../../Common/Http/HttpContent.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";

export class FileContent
{
	readonly #_httpContent: HttpContent;

	public constructor(httpContent: HttpContent)
	{
		SealedClassError.throwIfNotEqual(FileContent, new.target);
		ThrowHelper.TypeError.throwIfNotType(httpContent, HttpContent);

		this.#_httpContent = httpContent;
	}

	public async readAsStream()
	{
		return this.#_httpContent.readAsStream();
	}

	public async readAsByteArray()
	{
		return this.#_httpContent.readAsByteArray();
	}
}

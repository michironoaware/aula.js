import { FileData } from "./Models/FileData.js";
import { RestClient } from "../RestClient.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";

export class File
{
	readonly #_data: FileData;
	readonly #_restClient: RestClient;
	#_contentSize: bigint | null = null;

	public constructor(data: FileData, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(File, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, FileData);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

		this.#_data = data;
		this.#_restClient = restClient;
	}

	public get restClient()
	{
		return this.#_restClient;
	}

	public get id()
	{
		return this.#_data.id;
	}

	public get name()
	{
		return this.#_data.name;
	}

	public get contentType()
	{
		return this.#_data.contentType;
	}

	public get contentSize()
	{
		return this.#_contentSize ??= BigInt(this.#_data.contentSize);
	}

	public getContent()
	{
		return this.restClient.getFileContent(this.id);
	}
}

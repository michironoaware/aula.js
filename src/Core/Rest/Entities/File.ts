import { FileData } from "./Models/FileData";
import { RestClient } from "../RestClient";
import { ThrowHelper } from "../../../Common/ThrowHelper";
import { SealedClassError } from "../../../Common/SealedClassError";
import { CancellationToken } from "../../../Common/Threading/CancellationToken";

/**
 * Represents a file within Aula.
 * */
export class File
{
	readonly #_data: FileData;
	readonly #_restClient: RestClient;
	#_contentSize: bigint | null = null;

	/**
	 * Initializes a new instance of {@link File}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: FileData, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(File, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, FileData);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

		this.#_data = data;
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
	 * Gets the id of the file.
	 * */
	public get id()
	{
		return this.#_data.id;
	}

	/**
	 * Get the name of the file.
	 * */
	public get name()
	{
		return this.#_data.name;
	}

	/**
	 * Gets the media type of the content as defined in {@link https://www.rfc-editor.org/rfc/rfc6838 RFC 6836}.
	 * */
	public get contentType()
	{
		return this.#_data.contentType;
	}

	/**
	 * Gets the size of the content in bytes.
	 * */
	public get contentSize()
	{
		return this.#_contentSize ??= BigInt(this.#_data.contentSize);
	}

	/**
	 * Gets the file content as an asynchronous operation.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A Promise that resolves to a new {@link FileContent} instance representing the contents of the file.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * */
	public getContent(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return this.restClient.getFileContent(this.id, cancellationToken);
	}
}

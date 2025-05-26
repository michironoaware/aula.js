import { SealedClassError } from "../../../../Common/SealedClassError";
import { ThrowHelper } from "../../../../Common/ThrowHelper";

/**
 * Provides a strongly typed DTO class for the API v1 FileData JSON schema.
 * @sealed
 * @package
 * */
export class FileData
{
	readonly #_id: string;
	readonly #_name: string;
	readonly #_contentType: string;
	readonly #_size: string;

	/**
	 * Initializes a new instance of {@link FileData}.
	 * @param data An object that conforms to the API v1 FileData JSON schema
	 *             from where the data will be extracted.
	 * */
	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(FileData, new.target);
		ThrowHelper.TypeError.throwIfNotType(data.id, "string");
		ThrowHelper.TypeError.throwIfNotType(data.name, "string");
		ThrowHelper.TypeError.throwIfNotType(data.contentType, "string");
		ThrowHelper.TypeError.throwIfNotType(data.size, "string");

		this.#_id = data.id;
		this.#_name = data.name;
		this.#_contentType = data.contentType;
		this.#_size = data.size;
	}

	/**
	 * Gets the id of the file.
	 * */
	public get id()
	{
		return this.#_id;
	}

	/**
	 * Gets the name of the file.
	 * */
	public get name()
	{
		return this.#_name;
	}

	/**
	 * Gets the media type of the file content as defined in {@link https://www.rfc-editor.org/rfc/rfc6838 RFC 6836}.
	 * */
	public get contentType()
	{
		return this.#_contentType;
	}

	/**
	 * Gets the size of the file content in bytes.
	 * */
	public get size()
	{
		return this.#_size;
	}
}

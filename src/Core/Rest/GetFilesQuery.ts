import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";

/**
 * Represents the query options used to retrieve files.
 * @sealed
 */
export class GetFilesQuery
{
	static #_default: GetFilesQuery | null = null;

	#_count: number | null = null;
	#_after: string | null = null;

	/**
	 * Initializes a new instance of {@link GetFilesQuery}.
	 */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(GetFilesQuery, new.target);
	}

	/**
	 * Gets the default query options.
	 */
	public static get default()
	{
		return this.#_default ??= new GetFilesQuery();
	}

	/**
	 * Gets the maximum number of files to return.
	 * @default null
	 */
	public get count()
	{
		return this.#_count;
	}

	/**
	 * Sets the maximum number of files to return.
	 * @param count The number of files to retrieve, or `null` to let the server decide.
	 */
	public set count(count: number | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(count, "number", "null");
		this.#_count = count;
	}

	/**
	 * Gets the id of the file from which to start returning results, **excluding** that file.
	 * @default null
	 */
	public get after()
	{
		return this.#_after;
	}

	/**
	 * Sets the id of the file from which to start returning results.
	 * @param after The id of the file from which to start returning results, **excluding** that file.
	 */
	public set after(after: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(after, "string", "null");
		this.#_after = after;
	}

	/**
	 * Sets the maximum number of files to retrieve.
	 * @param count The number of files to return, or `null` to let the server decide.
	 * @returns The current {@link GetFilesQuery} instance.
	 */
	public withCount(count: number | null)
	{
		this.count = count;
		return this;
	}

	/**
	 * Sets the id of the file from which to start returning results.
	 * @param after The id of the file from which to start returning results, **excluding** that file.
	 * @returns The current {@link GetFilesQuery} instance.
	 */
	public withAfter(after: string | null)
	{
		this.after = after;
		return this;
	}
}

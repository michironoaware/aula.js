import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";
import { BanType } from "./Entities/BanType";

/**
 * Represents the query options used to retrieve bans.
 * @sealed
 */
export class GetBansQuery
{
	static #_default: GetBansQuery | null = null;

	#_type: BanType | null = null;
	#_count: number | null = null;
	#_after: string | null = null;
	#_includeLifted: boolean | null = null;

	/**
	 * Initializes a new instance of {@link GetBansQuery}.
	 */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(GetBansQuery, new.target);
	}

	/**
	 * Gets the default query options.
	 */
	public static get default()
	{
		return this.#_default ??= new GetBansQuery();
	}

	/**
	 * Gets the type of ban to filter for.
	 * */
	public get type()
	{
		return this.#_type;
	}

	/**
	 * Sets the type of ban to filter for.
	 * @default null
	 * */
	public set type(type: BanType | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(type, "number", "null");
		this.#_type = type;
	}

	/**
	 * Gets the maximum number of bans to return.
	 * @default null
	 */
	public get count()
	{
		return this.#_count;
	}

	/**
	 * Sets the maximum number of bans to return.
	 * @param count The number of bans to retrieve, or `null` to let the server decide.
	 */
	public set count(count: number | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(count, "number", "null");
		this.#_count = count;
	}

	/**
	 * Gets the id of the ban from which to start returning results, **excluding** that ban.
	 * @default null
	 */
	public get after()
	{
		return this.#_after;
	}

	/**
	 * Sets the id of the ban from which to start returning results.
	 * @param after The id of the ban from which to start returning results, **excluding** that ban.
	 */
	public set after(after: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(after, "string", "null");
		this.#_after = after;
	}

	/**
	 * Gets whether to include lifted bans in the search.
	 * */
	public get includeLifted()
	{
		return this.#_includeLifted;
	}

	/**
	 * Sets whether to include lifted bans in the search.
	 * @default null
	 * */
	public set includeLifted(includeLifted: boolean | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(includeLifted, "boolean", "null");
		this.#_includeLifted = includeLifted;
	}

	/**
	 * Sets the type of ban to filter for.
	 * @param type The type of ban to filter for, or `null` to include all ban types.
	 * @returns The current {@link GetBansQuery} instance.
	 * */
	public withType(type: BanType | null)
	{
		this.type = type;
		return this;
	}

	/**
	 * Sets the maximum number of bans to retrieve.
	 * @param count The number of bans to return, or `null` to let the server decide.
	 * @returns The current {@link GetBansQuery} instance.
	 */
	public withCount(count: number | null)
	{
		this.count = count;
		return this;
	}

	/**
	 * Sets the id of the ban from which to start returning results.
	 * @param after The id of the ban from which to start returning results, **excluding** that ban.
	 * @returns The current {@link GetBansQuery} instance.
	 */
	public withAfter(after: string | null)
	{
		this.after = after;
		return this;
	}

	/**
	 * Sets whether to include lifted bans in the search.
	 * @param includeLifted A {@link boolean} indicating whether lifted bans should be included in the search,
	 * or `null` to fall back to the default behavior (same as `false`).
	 * @returns The current {@link GetBansQuery} instance.
	 * */
	public withIncludeLifted(includeLifted: boolean | null)
	{
		this.includeLifted = includeLifted;
		return this;
	}
}

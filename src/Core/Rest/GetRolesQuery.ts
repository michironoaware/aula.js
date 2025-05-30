import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";

/**
 * Represents the query options used to retrieve roles.
 * @sealed
 */
export class GetRolesQuery
{
	static #_default: GetRolesQuery | null = null;

	#_count: number | null = null;
	#_after: string | null = null;

	/**
	 * Initializes a new instance of {@link GetRolesQuery}.
	 */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(GetRolesQuery, new.target);
	}

	/**
	 * Gets the default query options.
	 */
	public static get default()
	{
		return this.#_default ??= new GetRolesQuery();
	}

	/**
	 * Gets the maximum number of roles to return.
	 * @default null
	 */
	public get count()
	{
		return this.#_count;
	}

	/**
	 * Sets the maximum number of roles to return.
	 * @param count The number of roles to retrieve, or `null` to let the server decide.
	 */
	public set count(count: number | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(count, "number", "null");
		this.#_count = count;
	}

	/**
	 * Gets the id of the role from which to start returning results, **excluding** that role.
	 * @default null
	 */
	public get after()
	{
		return this.#_after;
	}

	/**
	 * Sets the id of the role from which to start returning results.
	 * @param after The id of the role from which to start returning results, **excluding** that role.
	 */
	public set after(after: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(after, "string", "null");
		this.#_after = after;
	}

	/**
	 * Sets the maximum number of roles to retrieve.
	 * @param count The number of roles to return, or `null` to let the server decide.
	 * @returns The current {@link GetRolesQuery} instance.
	 */
	public withCount(count: number | null)
	{
		this.count = count;
		return this;
	}

	/**
	 * Sets the id of the role from which to start returning results.
	 * @param after The id of the role from which to start returning results, **excluding** that role.
	 * @returns The current {@link GetRolesQuery} instance.
	 */
	public withAfter(after: string | null)
	{
		this.after = after;
		return this;
	}
}

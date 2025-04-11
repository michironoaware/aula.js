import { UserType } from "./Entities/UserType.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";

/**
 * Represents the query options used to retrieve users.
 * @sealed
 */
export class GetUsersQuery
{
	static readonly #_default: GetUsersQuery = new GetUsersQuery();

	#_type: UserType | null = null;
	#_count: number | null = null;
	#_after: string | null = null;

	/**
	 * Initializes a new instance of {@link GetUsersQuery}.
	 */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(GetUsersQuery, new.target);
	}

	/**
	 * Gets the default query options.
	 */
	public static get default()
	{
		return this.#_default;
	}

	/**
	 * Sets the user type filter for the query.
	 * @default null
	 */
	public get type()
	{
		return this.#_type;
	}

	/**
	 * Sets the user type filter for the query.
	 * @param type The {@link UserType} to filter by, or `null` to include all types.
	 */
	public set type(type: UserType | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(type, "number", "null");
		this.#_type = type;
	}

	/**
	 * Gets the maximum number of users to return.
	 * @default null
	 */
	public get count()
	{
		return this.#_count;
	}

	/**
	 * Sets the maximum number of users to return.
	 * @param count The number of users to retrieve, or `null` to let the server decide.
	 */
	public set count(count: number | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(count, "number", "null");
		this.#_count = count;
	}

	/**
	 * Gets the id of the user from which to start returning results, **excluding** that user.
	 * @default null
	 */
	public get after()
	{
		return this.#_after;
	}

	/**
	 * Sets the id of the user from which to start returning results.
	 * @param after The id of the user from which to start returning results, **excluding** that user.
	 */
	public set after(after: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(after, "string", "null");
		this.#_after = after;
	}

	/**
	 * Sets the user type filter for the query.
	 * @param type The {@link UserType} to filter by, or `null` to include all types.
	 * @returns The current {@link GetUsersQuery} instance.
	 */
	public withType(type: UserType | null)
	{
		this.type = type;
		return this;
	}

	/**
	 * Sets the maximum number of users to retrieve.
	 * @param count The number of users to return, or `null` to let the server decide.
	 * @returns The current {@link GetUsersQuery} instance.
	 */
	public withCount(count: number | null)
	{
		this.count = count;
		return this;
	}

	/**
	 * Sets the id of the user from which to start returning results.
	 * @param after The id of the user from which to start returning results, **excluding** that user.
	 * @returns The current {@link GetUsersQuery} instance.
	 */
	public withAfter(after: string | null)
	{
		this.after = after;
		return this;
	}
}

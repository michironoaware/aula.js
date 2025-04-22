import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";

/**
 * Represents the query options used to retrieve rooms.
 * @sealed
 */
export class GetRoomsQuery
{
	static #_default: GetRoomsQuery | null = null;

	#_count: number | null = null;
	#_after: string | null = null;

	/**
	 * Initializes a new instance of {@link GetRoomsQuery}.
	 */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(GetRoomsQuery, new.target);
	}

	/**
	 * Gets the default query options.
	 */
	public static get default()
	{
		return this.#_default ??= new GetRoomsQuery();
	}

	/**
	 * Gets the maximum number of rooms to return.
	 * @default null
	 */
	public get count()
	{
		return this.#_count;
	}

	/**
	 * Sets the maximum number of rooms to return.
	 * @param count The number of rooms to retrieve, or `null` to let the server decide.
	 */
	public set count(count: number | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(count, "number", "null");
		this.#_count = count;
	}

	/**
	 * Gets the id of the room from which to start returning results, **excluding** that room.
	 * @default null
	 */
	public get after()
	{
		return this.#_after;
	}

	/**
	 * Sets the id of the room from which to start returning results.
	 * @param after The id of the room from which to start returning results, **excluding** that room.
	 */
	public set after(after: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(after, "string", "null");
		this.#_after = after;
	}

	/**
	 * Sets the maximum number of rooms to retrieve.
	 * @param count The number of rooms to return, or `null` to let the server decide.
	 * @returns The current {@link GetRoomsQuery} instance.
	 */
	public withCount(count: number | null)
	{
		this.count = count;
		return this;
	}

	/**
	 * Sets the id of the room from which to start returning results.
	 * @param after The id of the room from which to start returning results, **excluding** that room.
	 * @returns The current {@link GetRoomsQuery} instance.
	 */
	public withAfter(after: string | null)
	{
		this.after = after;
		return this;
	}
}

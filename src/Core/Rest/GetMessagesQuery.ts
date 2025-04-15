import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";

/**
 * Represents the query options used to retrieve messages.
 * @sealed
 */
export class GetMessagesQuery
{
	static #_default: GetMessagesQuery | null = null;

	#_count: number | null = null;
	#_before: string | null = null;
	#_after: string | null = null;

	/**
	 * Initializes a new instance of {@link GetMessagesQuery}.
	 */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(GetMessagesQuery, new.target);
	}

	/**
	 * Gets the default query options.
	 */
	public static get default()
	{
		return this.#_default ??= new GetMessagesQuery();
	}

	/**
	 * Gets the maximum number of messages to return.
	 * @default null
	 */
	public get count()
	{
		return this.#_count;
	}

	/**
	 * Sets the maximum number of messages to return.
	 * @param count The number of messages to retrieve, or `null` to let the server decide.
	 */
	public set count(count: number | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(count, "number", "null");
		this.#_count = count;
	}

	/**
	 * Gets the id of the message from which to start returning results backwards, **excluding** that message.
	 * @default null
	 */
	public get before()
	{
		return this.#_before;
	}

	/**
	 * Sets the id of the message from which to start returning results backwards.
	 * @param before The id of the message from which to start returning results backwards, **excluding** that message.
	 */
	public set before(before: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(before, "string", "null");
		this.#_before = before;
	}

	/**
	 * Gets the id of the message from which to start returning results, **excluding** that message.
	 * @default null
	 */
	public get after()
	{
		return this.#_after;
	}

	/**
	 * Sets the id of the message from which to start returning results.
	 * @param after The id of the message from which to start returning results, **excluding** that message.
	 */
	public set after(after: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(after, "string", "null");
		this.#_after = after;
	}

	/**
	 * Sets the maximum number of messages to retrieve.
	 * @param count The number of messages to return, or `null` to let the server decide.
	 * @returns The current {@link GetMessagesQuery} instance.
	 */
	public withCount(count: number | null)
	{
		this.count = count;
		return this;
	}

	/**
	 * Sets the id of the message from which to start returning results backwards.
	 * @param before The id of the message from which to start returning results backwards, **excluding** that message.
	 * @returns The current {@link GetMessagesQuery} instance.
	 */
	public withBefore(before: string | null)
	{
		this.before = before;
		return this;
	}

	/**
	 * Sets the id of the message from which to start returning results.
	 * @param after The id of the message from which to start returning results, **excluding** that message.
	 * @returns The current {@link GetMessagesQuery} instance.
	 */
	public withAfter(after: string | null)
	{
		this.after = after;
		return this;
	}
}

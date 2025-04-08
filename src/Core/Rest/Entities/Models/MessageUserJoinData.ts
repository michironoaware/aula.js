import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../../Common/SealedClassError.js";

/**
 * Provides a strongly typed DTO class for the API v1 MessageUserJoinData JSON schema.
 * @package
 * */
export class MessageUserJoinData
{
	readonly #_userId: string;
	readonly #_previousRoomId: string | null;

	/**
	 * Initializes a new instance of {@link MessageUserJoinData}.
	 * @param data An object that conforms to the API v1 MessageUserJoinData JSON schema
	 *             from where the data will be extracted.
	 * */
	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(MessageUserJoinData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.userId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(data.previousRoomId, "string", "nullable");

		this.#_userId = data.userId;
		this.#_previousRoomId = data.previousRoomId ?? null;
	}

	/**
	 * Gets the id of the user who joined the room.
	 * */
	public get userId()
	{
		return this.#_userId;
	}

	/**
	 * Gets the id of the previous room where the user was.
	 * */
	public get previousRoomId()
	{
		return this.#_previousRoomId;
	}
}

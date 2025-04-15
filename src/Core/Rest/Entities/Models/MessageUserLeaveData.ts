import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../../Common/SealedClassError.js";

/**
 * Provides a strongly typed DTO class for the API v1 MessageUserLeaveData JSON schema.
 * @sealed
 * @package
 * */
export class MessageUserLeaveData
{
	readonly #_userId: string;
	readonly #_roomId: string | null;

	/**
	 * Initializes a new instance of {@link MessageUserLeaveData}.
	 * @param data An object that conforms to the API v1 MessageUserLeaveData JSON schema
	 *             from where the data will be extracted.
	 * */
	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(MessageUserLeaveData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.userId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(data.roomId, "string", "nullable");

		this.#_userId = data.userId;
		this.#_roomId = data.roomId ?? null;
	}

	/**
	 * Gets the id of the user who left the room.
	 * */
	public get userId()
	{
		return this.#_userId;
	}

	/**
	 * Gets the id of the room the user went to.
	 * */
	public get roomId()
	{
		return this.#_roomId;
	}
}

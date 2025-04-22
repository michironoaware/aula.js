import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";

/**
 * Represents the request body used to set the user's room.
 * @sealed
 * */
export class SetUserRoomRequestBody
{
	#_roomId: string | null = null;

	/**
	 * Initializes a new instance of {@link SetUserRoomRequestBody}.
	 * */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(SetUserRoomRequestBody, new.target);
	}

	/**
	 * Gets the id of the room to which the user will be relocated.
	 * */
	public get roomId()
	{
		return this.#_roomId;
	}

	/**
	 * Sets the id of the room to which the user will be relocated.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param roomId the id of the room, or `null` to relocate the user to no room.
	 * */
	public set roomId(roomId: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(roomId, "string", "null");
		this.#_roomId = roomId;
	}

	/**
	 * Sets the id of the room to which the user will be relocated.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param roomId the id of the room, or `null` to relocate the user to no room.
	 * @return The current {@link SetUserRoomRequestBody} instance.
	 * */
	public withRoomId(roomId: string | null)
	{
		this.roomId = roomId;
		return this;
	}

	public toJSON()
	{
		return { roomId: this.#_roomId };
	}
}

import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";

/**
 * Represents the request body used to override the connected rooms of a room.
 * @sealed
 * */
export class SetRoomConnectionsRequestBody
{
	#_roomIds: string[] | null = null;

	/**
	 * Initializes a new instance of {@link SetRoomConnectionsRequestBody}.
	 * */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(SetRoomConnectionsRequestBody, new.target);
	}

	/**
	 * Gets the id collection of rooms to connect to the room.
	 * */
	public get roomIds()
	{
		return this.#_roomIds;
	}

	/**
	 * Sets the id collection of rooms to connect to the room.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param roomIds The collection of room ids.
	 * */
	public set roomIds(roomIds: string[] | null)
	{
		if (this.#_roomIds === null)
		{
			this.#_roomIds = null;
			return;
		}

		ThrowHelper.TypeError.throwIfNotTypeArray(roomIds, "string");
		this.#_roomIds = [ ...roomIds ]; // TODO: ReadOnlyArray wrapper
	}

	/**
	 * Sets the id collection of rooms to connect to the room.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param roomIds The collection of room ids.
	 * @returns The current {@link SetRoomConnectionsRequestBody} instance.
	 * */
	public withRoomIds(roomIds: string[] | null)
	{
		this.roomIds = roomIds;
		return this;
	}

	public toJSON()
	{
		return { roomIds: this.#_roomIds };
	}
}

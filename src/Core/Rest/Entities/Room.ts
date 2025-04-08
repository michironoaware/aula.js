import { RestClient } from "../RestClient.js";
import { RoomData } from "./Models/RoomData.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { IModifyRoomRequestBody } from "../IModifyRoomRequestBody.js";
import { TypeHelper } from "../../../Common/TypeHelper.js";
import { ArrayHelper } from "../../../Common/ArrayHelper.js";
import { RoomType } from "./RoomType.js";

/**
 * Represents a room within Aula.
 * A room represents a virtual space, a user can move between rooms and perform room-specific actions while "inside".
 * */
export class Room
{
	readonly #_restClient: RestClient;
	readonly #_data: RoomData;
	#_creationDate: Date | null = null;

	/**
	 * Initializes a new instance of {@link Room}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: RoomData, restClient: RestClient)
	{
		ThrowHelper.TypeError.throwIfNotType(data, RoomData);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

		this.#_restClient = restClient;
		this.#_data = data;
	}

	/**
	 * Gets the {@link RestClient} that initialized this instance.
	 * */
	public get restClient()
	{
		return this.#_restClient;
	}

	/**
	 * Gets the id of the room.
	 * */
	public get id()
	{
		return this.#_data.id;
	}

	/**
	 * Gets the type of the room.
	 * */
	public get type()
	{
		return this.#_data.type as RoomType;
	}

	/**
	 * Gets the name of the room.
	 * */
	public get name()
	{
		return this.#_data.name;
	}

	/**
	 * Gets the description of the room.
	 * */
	public get description()
	{
		return this.#_data.description;
	}

	/**
	 * Gets whether the room serves as an entry point for users without an established current room.
	 * */
	public get isEntrance()
	{
		return this.#_data.isEntrance;
	}

	/**
	 * Gets the file id of the background audio associated with this room.
	 * */
	public get backgroundAudioId()
	{
		return this.#_data.backgroundAudioId;
	}

	/**
	 * Gets the collection of ids of the rooms that a user can travel to from this room.
	 * */
	public get connectedRoomIds()
	{
		return this.#_data.connectedRoomIds;
	}

	/**
	 * Gets the creation date of the room as a {@link Date} object.
	 * */
	get creationDate()
	{
		return this.#_creationDate ??= new Date(this.#_data.creationDate);
	}

	/**
	 * Gets the latest version of the room.
	 * @returns A promise that resolves to a {@link Room}, or `null` if the room no longer exists.
	 * */
	public async getLatest()
	{
		return await this.restClient.getRoom(this.id);
	}

	/**
	 * Modifies the room.
	 * @param body An object containing the properties to update for the room.
	 * @returns A promise that resolves to a new, updated {@link Room}.
	 */
	public async modify(body: IModifyRoomRequestBody)
	{
		return await this.restClient.modifyRoom(this.id, body);
	}

	/**
	 * Removes the room.
	 * @returns A promise that resolves once the operation is complete.
	 * */
	public async remove()
	{
		return await this.restClient.removeRoom(this.id);
	}

	/**
	 * Gets the collection of rooms that a user can travel to from this room.
	 * @returns A promise that resolves to a {@link Room} array.
	 * */
	public async getConnectedRooms()
	{
		return await this.restClient.getRoomConnections(this.id);
	}

	/**
	 * Sets the collection of rooms that a user can travel to from this room.
	 * @param rooms A collection containing the id of the rooms.
	 * @returns A promise that resolves once the operation is complete.
	 * */
	public async setConnectedRooms(rooms: Iterable<Room | string>)
	{
		ThrowHelper.TypeError.throwIfNotType(rooms, "iterable");

		const roomIds = ArrayHelper.asArray(rooms).map(r => TypeHelper.isType(r, Room) ? r.id : r);
		for (const roomId of roomIds)
		{
			ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		}

		return await this.restClient.setRoomConnections(this.id, { roomIds });
	}

	/**
	 * Adds a room to the collection of rooms that a user can travel to from this room.
	 * @param room The id of the room to add to the collection.
	 * @returns A promise that resolves once the operation is complete.
	 * */
	public async addRoomConnection(room: Room | string)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(room, Room, "string");

		const roomId = TypeHelper.isType(room, Room) ? room.id : room;
		return await this.restClient.addRoomConnection(this.id, roomId);
	}

	/**
	 * Removes a room to the collection of rooms that a user can travel to from this room.
	 * @param room The id of the room to remove from the collection.
	 * @returns A promise that resolves once the operation is complete.
	 * */
	public async removeRoomConnection(room: Room | string)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(room, Room, "string");

		const roomId = TypeHelper.isType(room, Room) ? room.id : room;
		return await this.restClient.removeRoomConnection(this.id, roomId);
	}

	/**
	 * Gets the collection of users that are currently located in the room.
	 * @returns A promise that resolves to a {@link User} array.
	 * */
	public async getUsers()
	{
		return await this.restClient.getRoomUsers(this.id);
	}
}

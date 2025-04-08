import { RestClient } from "../RestClient.js";
import { RoomData } from "./Models/RoomData.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { IModifyRoomRequestBody } from "../IModifyRoomRequestBody.js";
import { TypeHelper } from "../../../Common/TypeHelper.js";
import { ArrayHelper } from "../../../Common/ArrayHelper.js";
import { RoomType } from "./RoomType.js";

export class Room
{
	readonly #_restClient: RestClient;
	readonly #_data: RoomData;
	#_creationDate: Date | null = null;

	public constructor(data: RoomData, restClient: RestClient)
	{
		ThrowHelper.TypeError.throwIfNotType(data, RoomData);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

		this.#_restClient = restClient;
		this.#_data = data;
	}

	public get restClient()
	{
		return this.#_restClient;
	}

	public get id()
	{
		return this.#_data.id;
	}

	public get type()
	{
		return this.#_data.type as RoomType;
	}

	public get name()
	{
		return this.#_data.name;
	}

	public get description()
	{
		return this.#_data.description;
	}

	public get isEntrance()
	{
		return this.#_data.isEntrance;
	}

	public get backgroundAudioId()
	{
		return this.#_data.backgroundAudioId;
	}

	public get connectedRoomIds()
	{
		return this.#_data.connectedRoomIds;
	}

	get creationDate()
	{
		return this.#_creationDate ??= new Date(this.#_data.creationDate);
	}

	public async getLatest()
	{
		return await this.restClient.getRoom(this.id);
	}

	public async modify(body: IModifyRoomRequestBody)
	{
		return await this.restClient.modifyRoom(this.id, body);
	}

	public async remove()
	{
		return await this.restClient.removeRoom(this.id);
	}

	public async getConnections()
	{
		return await this.restClient.getRoomConnections(this.id);
	}

	public async setConnections(rooms: Iterable<Room | string>)
	{
		ThrowHelper.TypeError.throwIfNotType(rooms, "iterable");

		const roomIds = ArrayHelper.asArray(rooms).map(r => TypeHelper.isType(r, Room) ? r.id : r);
		for (const roomId of roomIds)
		{
			ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		}

		return await this.restClient.setRoomConnections(this.id, { roomIds });
	}

	public async addConnection(room: Room | string)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(room, Room, "string");

		const roomId = TypeHelper.isType(room, Room) ? room.id : room;
		return await this.restClient.addRoomConnection(this.id, roomId);
	}

	public async removeConnection(room: Room | string)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(room, Room, "string");

		const roomId = TypeHelper.isType(room, Room) ? room.id : room;
		return await this.restClient.removeRoomConnection(this.id, roomId);
	}

	public async getUsers()
	{
		return await this.restClient.getRoomUsers(this.id);
	}
}

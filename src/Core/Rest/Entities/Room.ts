import { RestClient } from "../RestClient.js";
import { RoomData } from "./Models/RoomData.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { Temporal } from "@js-temporal/polyfill";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { IModifyRoomRequestBody } from "../IModifyRoomRequestBody.js";
import { TypeHelper } from "../../../Common/TypeHelper.js";
import { Message } from "./Message.js";
import { IGetMessagesQuery } from "../IGetMessagesQuery.js";
import { ISendMessageRequestBody } from "../ISendMessageRequestBody.js";
import { MessageType } from "./MessageType.js";
import { ArrayHelper } from "../../../Common/ArrayHelper.js";
import Instant = Temporal.Instant;

export class Room
{
	readonly #_restClient: RestClient;
	readonly #_data: RoomData;

	public constructor(data: RoomData, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(Room, new.target);
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

	public get connectedRoomIds()
	{
		return this.#_data.connectedRoomIds;
	}

	public get creationInstant()
	{
		return Instant.from(this.#_data.creationDate);
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

	public async startTyping()
	{
		return await this.restClient.startTyping(this.id);
	}

	public async stopTyping()
	{
		return await this.restClient.stopTyping(this.id);
	}

	public async getMessage(message: Message | string)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(message, Message, "string");

		const messageId = TypeHelper.isType(message, Message) ? message.id : message;
		return await this.restClient.getMessage(this.id, messageId);
	}

	public async getMessages(query: IGetMessagesQuery = {})
	{
		ThrowHelper.TypeError.throwIfNullable(query);
		return await this.restClient.getMessages(this.id, query);
	}

	public async sendMessage(message: ISendMessageRequestBody)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(message, "object", "string");

		let body: ISendMessageRequestBody;
		if (TypeHelper.isType(message, "string"))
		{
			body = { type: MessageType.Standard, content: message };
		}
		else
		{
			body = message;
		}

		return await this.restClient.sendMessage(this.id, body);
	}
}

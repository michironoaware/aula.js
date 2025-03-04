import {RestClient} from "../Rest/RestClient.js";
import {RoomData} from "./Models/RoomData.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";
import {Temporal} from "@js-temporal/polyfill";
import {SealedClassError} from "../../Common/SealedClassError.js";
import {IModifyRoomRequestBody} from "../Rest/IModifyRoomRequestBody.js";
import {TypeHelper} from "../../Common/TypeHelper.js";
import {Message} from "./Message.js";
import {IGetMessagesQuery} from "../Rest/IGetMessagesQuery.js";
import {ISendMessageRequestBody} from "../Rest/ISendMessageRequestBody.js";
import {MessageType} from "./MessageType.js";

export class Room
{
	readonly #restClient: RestClient;
	readonly #data: RoomData;
	public constructor(restClient: RestClient, data: RoomData)
	{
		SealedClassError.throwIfNotEqual(Room, new.target);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);
		ThrowHelper.TypeError.throwIfNotType(data, RoomData);

		this.#restClient = restClient;
		this.#data = data;
	}

	public get restClient()
	{
		return this.#restClient;
	}

	public get id()
	{
		return this.#data.id;
	}

	public get name()
	{
		return this.#data.name;
	}

	public get description()
	{
		return this.#data.description;
	}

	public get isEntrance()
	{
		return this.#data.isEntrance;
	}

	public get connectedRoomIds()
	{
		return this.#data.connectedRoomIds;
	}

	public get creationTime()
	{
		return Temporal.ZonedDateTime.from(this.#data.creationTime);
	}

	public async getLatest()
	{
		return await this.#restClient.getRoom(this.#data.id);
	}

	public async modify(body: IModifyRoomRequestBody)
	{
		return await this.#restClient.modifyRoom(this.#data.id, body);
	}

	public async remove()
	{
		return await this.#restClient.removeRoom(this.#data.id);
	}

	public async getConnections()
	{
		return await this.#restClient.getRoomConnections(this.#data.id);
	}

	public async setConnections(rooms: Iterable<Room | string>)
	{
		ThrowHelper.TypeError.throwIfNotType(rooms, "iterable");

		const roomIds = [...rooms].map(r => TypeHelper.isType(r, Room) ? r.id : r);
		for (const roomId of roomIds)
		{
			ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		}

		return await this.#restClient.setRoomConnections(this.#data.id, { roomIds });
	}

	public async addConnection(room: Room | string): Promise<void>
	{
		ThrowHelper.TypeError.throwIfNotAnyType(room, Room, "string");

		const roomId = TypeHelper.isType(room, Room) ? room.id : room;
		return await this.#restClient.addRoomConnection(this.#data.id, roomId);
	}

	public async removeConnection(room: Room | string): Promise<void>
	{
		ThrowHelper.TypeError.throwIfNotAnyType(room, Room, "string");

		const roomId = TypeHelper.isType(room, Room) ? room.id : room;
		return await this.#restClient.removeRoomConnection(this.#data.id, roomId);
	}

	public async getUsers()
	{
		return await this.#restClient.getRoomUsers(this.#data.id);
	}

	public async startTyping()
	{
		return await this.#restClient.startTyping(this.#data.id);
	}

	public async stopTyping()
	{
		return await this.#restClient.stopTyping(this.#data.id);
	}

	public async getMessage(message: Message | string)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(message, Message, "string");

		const messageId = TypeHelper.isType(message, Message) ? message.id : message;
		return await this.#restClient.getMessage(this.#data.id, messageId);
	}

	public async getMessages(query: IGetMessagesQuery = {})
	{
		ThrowHelper.TypeError.throwIfNotType(query, "object");
		return await this.#restClient.getMessages(this.#data.id, query);
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

		return await this.#restClient.sendMessage(this.#data.id, body);
	}
}

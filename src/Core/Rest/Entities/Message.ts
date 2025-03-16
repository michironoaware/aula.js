import { RestClient } from "../RestClient.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { MessageData } from "./Models/MessageData.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { MessageAuthorType } from "./MessageAuthorType.js";
import { MessageType } from "./MessageType.js";
import { MessageUserJoin } from "./MessageUserJoin.js";
import { MessageUserLeave } from "./MessageUserLeave.js";

export class Message
{
	readonly #_restClient: RestClient;
	readonly #_data: MessageData;
	readonly #_userJoin: MessageUserJoin | null;
	readonly #_userLeave: MessageUserLeave | null;

	public constructor(data: MessageData, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(Message, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, MessageData);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

		this.#_restClient = restClient;
		this.#_data = data;
		this.#_userJoin = data.joinData ? new MessageUserJoin(data.joinData, restClient) : null;
		this.#_userLeave = data.leaveData ? new MessageUserLeave(data.leaveData, restClient) : null;
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
		return this.#_data.type;
	}

	public get flags()
	{
		return this.#_data.flags;
	}

	public get authorType()
	{
		return this.#_data.authorType;
	}

	public get authorId()
	{
		return this.#_data.authorId;
	}

	public get roomId()
	{
		return this.#_data.roomId;
	}

	public get content()
	{
		return this.#_data.content;
	}

	public get userJoin()
	{
		return this.#_userJoin;
	}

	public get userLeave()
	{
		return this.#_userLeave;
	}

	get creationDate()
	{
		return new Date(this.#_data.creationDate);
	}

	public isStandardMessage(): this is IStandardMessage
	{
		return this.#_data.type === MessageType.Standard;
	}

	public isUserJoinMessage(): this is IUserJoinMessage
	{
		return this.#_data.type === MessageType.UserJoin;
	}

	public isUserLeaveMessage(): this is IUserLeaveMessage
	{
		return this.#_data.type === MessageType.UserJoin;
	}

	public async getAuthor()
	{
		if (this.authorId === null || this.authorType !== MessageAuthorType.User)
		{
			return null;
		}

		return await this.restClient.getUser(this.authorId);
	}

	public async getRoom()
	{
		return await this.restClient.getRoom(this.roomId);
	}

	public async remove()
	{
		return await this.restClient.removeMessage(this.roomId, this.id);
	}
}

interface IStandardMessage
{
	type: MessageType.Standard;
	userJoin: null;
	userLeave: null;
	content: string;
}

interface IUserJoinMessage
{
	type: MessageType.UserJoin;
	authorType: MessageAuthorType.System;
	authorId: null;
	userJoin: MessageUserJoin;
	userLeave: null;
	content: null;
}

interface IUserLeaveMessage
{
	type: MessageType.UserLeave;
	authorType: MessageAuthorType.System;
	authorId: null;
	userJoin: null;
	userLeave: MessageUserLeave;
	content: null;
}

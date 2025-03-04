import { RestClient } from "../Rest/RestClient.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { MessageData } from "./Models/MessageData.js";
import { Temporal } from "@js-temporal/polyfill";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { MessageAuthorType } from "./MessageAuthorType.js";
import { MessageType } from "./MessageType.js";
import { MessageUserJoin } from "./MessageUserJoin.js";
import { MessageUserLeave } from "./MessageUserLeave.js";

export class Message
{
	readonly #restClient: RestClient;
	readonly #data: MessageData;
	readonly #userJoin: MessageUserJoin | null;
	readonly #userLeave: MessageUserLeave | null;

	public constructor(restClient: RestClient, data: MessageData)
	{
		SealedClassError.throwIfNotEqual(Message, new.target);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);
		ThrowHelper.TypeError.throwIfNotType(data, MessageData);

		this.#restClient = restClient;
		this.#data = data;
		this.#userJoin = data.joinData ? new MessageUserJoin(restClient, data.joinData) : null;
		this.#userLeave = data.leaveData ? new MessageUserLeave(restClient, data.leaveData) : null;
	}

	public get restClient()
	{
		return this.#restClient;
	}

	public get id()
	{
		return this.#data.id;
	}

	public get type()
	{
		return this.#data.type;
	}

	public get flags()
	{
		return this.#data.flags;
	}

	public get authorType()
	{
		return this.#data.authorType;
	}

	public get authorId()
	{
		return this.#data.authorId;
	}

	public get roomId()
	{
		return this.#data.roomId;
	}

	public get content()
	{
		return this.#data.content;
	}

	public get userJoin()
	{
		return this.#userJoin;
	}

	public get userLeave()
	{
		return this.#userLeave;
	}

	public get creationTime()
	{
		return Temporal.ZonedDateTime.from(this.#data.creationTime);
	}

	public isStandardMessage(): this is IStandardMessage
	{
		return this.#data.type === MessageType.Standard;
	}

	public isUserJoinMessage(): this is IUserJoinMessage
	{
		return this.#data.type === MessageType.UserJoin;
	}

	public isUserLeaveMessage(): this is IUserLeaveMessage
	{
		return this.#data.type === MessageType.UserJoin;
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

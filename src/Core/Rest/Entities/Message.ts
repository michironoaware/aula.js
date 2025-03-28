import { RestClient } from "../RestClient.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { MessageData } from "./Models/MessageData.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { MessageAuthorType } from "./MessageAuthorType.js";
import { MessageType } from "./MessageType.js";
import { StandardMessage } from "./StandardMessage.js";
import { UserJoinMessage } from "./UserJoinMessage.js";
import { UserLeaveMessage } from "./UserLeaveMessage.js";
import { InvalidOperationError } from "../../../Common/InvalidOperationError.js";

export abstract class Message
{
	readonly #_restClient: RestClient;
	readonly #_data: MessageData;
	#_creationDate: Date | null = null;

	protected constructor(data: MessageData, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(Message, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, MessageData);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

		this.#_restClient = restClient;
		this.#_data = data;
	}

	public static create(data: MessageData, restClient: RestClient): Message
	{
		switch (data.type)
		{
			case MessageType.Standard:
				return new StandardMessage(data, restClient);
			case MessageType.UserJoin:
				return new UserJoinMessage(data, restClient);
			case MessageType.UserLeave:
				return new UserLeaveMessage(data, restClient);
			default:
				throw new InvalidOperationError("Unexpected message type.");
		}
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


	get creationDate()
	{
		return this.#_creationDate ??= new Date(this.#_data.creationDate);
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

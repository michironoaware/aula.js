import { RoomData } from "./Models/RoomData.js";
import { RestClient } from "../RestClient.js";
import { Room } from "./Room.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { Message } from "./Message.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { TypeHelper } from "../../../Common/TypeHelper.js";
import { IGetMessagesQuery } from "../IGetMessagesQuery.js";
import { ISendMessageRequestBody } from "../ISendMessageRequestBody.js";
import { MessageType } from "./MessageType.js";
import { RoomType } from "./RoomType.js";
import { InvalidOperationError } from "../../../Common/InvalidOperationError.js";

export class TextRoom extends Room
{
	public constructor(data: RoomData, restClient: RestClient)
	{
		super(data, restClient);
		SealedClassError.throwIfNotEqual(TextRoom, new.target);

		if (data.type !== RoomType.Text)
		{
			throw new InvalidOperationError(`Room type expected to be ${RoomType.Text}.`);
		}
	}

	public async startTyping()
	{
		return await this.restClient.startTyping(this.id);
	}

	public async stopTyping()
	{
		return await this.restClient.stopTyping(this.id);
	}

	public async getMessage(messageId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(messageId, "string");
		return await this.restClient.getMessage(this.id, messageId);
	}

	public async getMessages(query: IGetMessagesQuery = {})
	{
		ThrowHelper.TypeError.throwIfNullable(query);
		return await this.restClient.getMessages(this.id, query);
	}

	public async sendMessage(message: ISendMessageRequestBody | string)
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

	/**
	 * Gets the latest version of the room.
	 * @returns A promise that resolves to a {@link TextRoom}, or `null` if the room no longer exists.
	 * */
	public async getLatest()
	{
		return await super.getLatest() as TextRoom | null;
	}
}

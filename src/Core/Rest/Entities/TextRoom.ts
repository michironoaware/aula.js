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
}

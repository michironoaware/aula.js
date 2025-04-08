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

/**
 * Represents a text room within Aula.
 * A text room allows communication between users through text messages.
 * */
export class TextRoom extends Room
{
	/**
	 * Initializes a new instance of {@link TextRoom}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: RoomData, restClient: RestClient)
	{
		super(data, restClient);
		SealedClassError.throwIfNotEqual(TextRoom, new.target);

		if (data.type !== RoomType.Text)
		{
			throw new InvalidOperationError(`Room type expected to be ${RoomType.Text}.`);
		}
	}

	/**
	 * Notifies that the user started typing in the room.
	 * @returns A promise that resolves once the operation is complete.
	 * */
	public async startTyping()
	{
		return await this.restClient.startTyping(this.id);
	}

	/**
	 * Notifies that the user stopped typing in the room.
	 * @returns A promise that resolves once the operation is complete.
	 * */
	public async stopTyping()
	{
		return await this.restClient.stopTyping(this.id);
	}

	/**
	 * Gets a message sent in the room.
	 * @param messageId the id of the message to retrieve.
	 * @returns A promise that resolves to a {@link Message},
	 * or `null` if the message does not exist.
	 * */
	public async getMessage(messageId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(messageId, "string");
		return await this.restClient.getMessage(this.id, messageId);
	}

	/**
	 * Gets a collection of messages sent in the room.
	 * @param query The parameters for retrieving messages.
	 * @returns A promise that resolves to a {@link Message} array.
	 * */
	public async getMessages(query: IGetMessagesQuery = {})
	{
		ThrowHelper.TypeError.throwIfNullable(query);
		return await this.restClient.getMessages(this.id, query);
	}

	/**
	 * Sends a message in the room.
	 * @param message The request body for sending the message.
	 * @returns A promise that resolves to a {@link Message} representing the message sent.
	 * */
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

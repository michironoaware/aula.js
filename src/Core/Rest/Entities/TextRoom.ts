import { RoomData } from "./Models/RoomData";
import { RestClient } from "../RestClient";
import { Room } from "./Room";
import { SealedClassError } from "../../../Common/SealedClassError";
import { ThrowHelper } from "../../../Common/ThrowHelper";
import { TypeHelper } from "../../../Common/TypeHelper";
import { MessageType } from "./MessageType";
import { RoomType } from "./RoomType";
import { InvalidOperationError } from "../../../Common/InvalidOperationError";
import { GetMessagesQuery } from "../GetMessagesQuery";
import { SendMessageRequestBody } from "../SendMessageRequestBody";
import { CancellationToken } from "../../../Common/Threading/CancellationToken";

/**
 * Represents a text room within Aula.
 * A text room allows communication between users through text messages.
 * @sealed
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
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * */
	public async startTyping(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return await this.restClient.startTyping(this.id, cancellationToken);
	}

	/**
	 * Notifies that the user stopped typing in the room.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * */
	public async stopTyping(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return await this.restClient.stopTyping(this.id, cancellationToken);
	}

	/**
	 * Gets a message sent in the room.
	 * @param messageId the id of the message to retrieve.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Message},
	 * or `null` if the message does not exist.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * */
	public async getMessage(messageId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(messageId, "string");
		return await this.restClient.getMessage(this.id, messageId, cancellationToken);
	}

	/**
	 * Gets a collection of messages sent in the room.
	 * @param query The parameters for retrieving messages.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Message} array.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * */
	public async getMessages(
		query: GetMessagesQuery = GetMessagesQuery.default,
		cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNullable(query);
		return await this.restClient.getMessages(this.id, query, cancellationToken);
	}

	/**
	 * Sends a message in the room.
	 * @param message The request body for sending the message.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Message} representing the message sent.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * */
	public async sendMessage(message: SendMessageRequestBody | string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(message, SendMessageRequestBody, "string");

		let body: SendMessageRequestBody;
		if (TypeHelper.isType(message, "string"))
		{
			body = new SendMessageRequestBody()
				.withType(MessageType.Standard)
				.withText(message);
		}
		else
		{
			body = message;
		}

		return await this.restClient.sendMessage(this.id, body, cancellationToken);
	}

	/**
	 * Gets the latest version of the room.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link TextRoom}, or `null` if the room no longer exists.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * */
	public async getLatest(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return await super.getLatest(cancellationToken) as TextRoom | null;
	}
}

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
 * Represents a standard room within Aula.
 * A standard room allows communication between users through messages.
 * @sealed
 * */
export class StandardRoom extends Room
{
	/**
	 * Initializes a new instance of {@link StandardRoom}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: RoomData, restClient: RestClient)
	{
		super(data, restClient);
		SealedClassError.throwIfNotEqual(StandardRoom, new.target);

		if (data.type !== RoomType.Standard)
		{
			throw new InvalidOperationError(`Room type expected to be ${RoomType.Standard}.`);
		}
	}

	/**
	 * Notifies that the current user started typing in the room.
	 * Requires the {@link Permissions.SendMessages} permission.
	 * Fires a {@link UserStartedTypingEvent} gateway event.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * @throws {AulaNotFoundError} If the room no longer exists.
	 * */
	public async startTyping(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return await this.restClient.startTyping(this.id, cancellationToken);
	}

	/**
	 * Gets a message sent in the room.
	 * Requires the {@link Permissions.ReadMessages} permission.
	 * @param messageId the id of the message to retrieve.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Message},
	 * or `null` if the message does not exist.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * */
	public async getMessage(messageId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(messageId, "string");
		return await this.restClient.getMessage(this.id, messageId, cancellationToken);
	}

	/**
	 * Gets a collection of messages sent in the room.
	 * Requires the {@link Permissions.ReadMessages} permission.
	 * @param query The parameters for retrieving messages.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Message} array.@throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * @throws {AulaNotFoundError} If the room no longer exists.
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
	 * Requires the {@link Permissions.SendMessages} permission.
	 * Fires a {@link MessageCreatedEvent} gateway event.
	 * @param message A {@link SendMessageRequestBody} containing the properties of the message,
	 * or a string containing the text content of the message.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Message} representing the message sent.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * @throws {AulaNotFoundError} If the room no longer exists.
	 * */
	public async sendMessage(message: SendMessageRequestBody | string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(message, SendMessageRequestBody, "string");

		let body: SendMessageRequestBody;
		if (TypeHelper.isType(message, "string"))
		{
			body = new SendMessageRequestBody()
				.withType(MessageType.Default)
				.withText(message);
		}
		else
		{
			body = message;
		}

		return await this.restClient.sendMessage(this.id, body, cancellationToken);
	}
}

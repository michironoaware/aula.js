import { RestClient } from "../RestClient";
import { ThrowHelper } from "../../../Common/ThrowHelper";
import { MessageData } from "./Models/MessageData";
import { MessageAuthorType } from "./MessageAuthorType";
import { MessageFlags } from "./MessageFlags";
import { UnreachableError } from "../../../Common/UnreachableError";
import { CancellationToken } from "../../../Common/Threading/CancellationToken";

/**
 * Represents a message within Aula.
 * */
export class Message
{
	readonly #_restClient: RestClient;
	readonly #_data: MessageData;
	#_creationDate: Date | null = null;
	#_flags: MessageFlags | null = null;

	/**
	 * Initializes a new instance of {@link Message}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: MessageData, restClient: RestClient)
	{
		ThrowHelper.TypeError.throwIfNotType(data, MessageData);
		//ThrowHelper.TypeError.throwIfNotType(restClient, RestClient); // Circular dependency problem

		this.#_restClient = restClient;
		this.#_data = data;

		this.restClient.cache?.set(this.id, this);
	}

	/**
	 * Gets the {@link RestClient} that initialized this instance.
	 * */
	public get restClient()
	{
		return this.#_restClient;
	}

	/**
	 * Gets the id of the message.
	 * */
	public get id()
	{
		return this.#_data.id;
	}

	/**
	 * Gets the type of the message.
	 * */
	public get type()
	{
		return this.#_data.type;
	}

	/**
	 * Gets the flag bit fields of the message.
	 * */
	public get flags()
	{
		return this.#_flags ??= BigInt(this.#_data.flags);
	}

	/**
	 * Gets the type of author of the message.
	 * */
	public get authorType()
	{
		return this.#_data.authorType;
	}

	/**
	 * Gets the id of the author of the message.
	 * */
	public get authorId()
	{
		return this.#_data.authorId;
	}

	/**
	 * Gets the id of the room where the message was sent.
	 * */
	public get roomId()
	{
		return this.#_data.roomId;
	}

	/**
	 * Gets the emission date of the message as a {@link Date} object.
	 * */
	get creationDate()
	{
		return this.#_creationDate ??= new Date(this.#_data.creationDate);
	}

	/**
	 * Gets the author of the message.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link User}, or `null` if the author is not a user.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * */
	public async getAuthor(cancellationToken: CancellationToken = CancellationToken.none)
	{
		if (this.authorType !== MessageAuthorType.User ||
		    this.authorId === null)
		{
			return null;
		}

		const author = await this.restClient.getUser(this.authorId, cancellationToken);
		if (author === null)
		{
			throw new UnreachableError("User expected to exist, but the server sent nothing.");
		}

		return author;
	}

	/**
	 * Gets the room where the message was sent.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Room}, or `null` if the room no longer exists.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * */
	public async getRoom(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return await this.restClient.getRoom(this.roomId, cancellationToken);
	}

	/**
	 * Deletes the message from the room where it was sent.
	 * Requires the {@link Permissions.ManageMessages} permission or being the user that sent the message.
	 * Fires a {@link MessageDeletedEvent} gateway event.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * @throws {AulaNotFoundError} If the room where the message was sent no longer exists.
	 * */
	public async delete(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return await this.restClient.deleteMessage(this.roomId, this.id, cancellationToken);
	}
}

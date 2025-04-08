import { RestClient } from "../RestClient.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { MessageData } from "./Models/MessageData.js";
import { MessageAuthorType } from "./MessageAuthorType.js";
import { MessageFlags } from "./MessageFlags.js";

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
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

		this.#_restClient = restClient;
		this.#_data = data;
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
	 * Gets the latest version of the message.
	 * @returns A promise that resolves to a {@link Message}, or `null` if the message no longer exists.
	 * */
	public async getLatest()
	{
		return await this.restClient.getMessage(this.roomId, this.id);
	}

	/**
	 * Gets the author of the message.
	 * @returns A promise that resolves to a {@link User},
	 * or `null` if the author is not a user or no longer exists.
	 * */
	public async getAuthor()
	{
		if (this.authorId === null || this.authorType !== MessageAuthorType.User)
		{
			return null;
		}

		return await this.restClient.getUser(this.authorId);
	}

	/**
	 * Gets the room where the message was sent.
	 * @returns A promise that resolves to a {@link Room}, or `null` if the room no longer exists.
	 * */
	public async getRoom()
	{
		return await this.restClient.getRoom(this.roomId);
	}

	/**
	 * Removes the message from the room where it was sent.
	 * @returns A promise that resolves when the operation is completed.
	 * */
	public async remove()
	{
		return await this.restClient.removeMessage(this.roomId, this.id);
	}
}

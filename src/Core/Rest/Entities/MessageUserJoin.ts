import { SealedClassError } from "../../../Common/SealedClassError.js";
import { MessageUserJoinData } from "./Models/MessageUserJoinData.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { RestClient } from "../RestClient.js";
import { UnreachableError } from "../../../Common/UnreachableError.js";

/**
 * Holds the additional data included in {@link MessageType.UserJoin} messages.
 * */
export class MessageUserJoin
{
	readonly #_restClient: RestClient;
	readonly #_data: MessageUserJoinData;

	/**
	 * Initializes a new instance of {@link MessageUserJoin}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: MessageUserJoinData, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(MessageUserJoin, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, MessageUserJoinData);
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
	 * Gets the id of the user who joined the room.
	 * */
	public get userId()
	{
		return this.#_data.userId;
	}

	/**
	 * Gets the id of the room where the user comes from.
	 * */
	public get previousRoomId()
	{
		return this.#_data.previousRoomId;
	}

	/**
	 * Gets the user that joined the room.
	 * @returns A promise that resolves to a {@link User}.
	 * */
	public async getUser()
	{
		const user = await this.restClient.getUser(this.userId);
		if (user === null)
		{
			throw new UnreachableError("User expected to exist, but the server sent nothing.");
		}

		return user;
	}

	/**
	 * Gets the room where the user comes from.
	 * @returns A promise that resolves to a {@link Room}, or `null` if the room no longer exists.
	 * */
	public async getPreviousRoom()
	{
		return this.previousRoomId !== null ? await this.restClient.getRoom(this.previousRoomId) : null;
	}
}

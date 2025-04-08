import { MessageUserLeaveData } from "./Models/MessageUserLeaveData.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { RestClient } from "../RestClient.js";
import { UnreachableError } from "../../../Common/UnreachableError.js";

/**
 * Holds the additional data included in {@link MessageType.UserLeave} messages.
 * */
export class MessageUserLeave
{
	readonly #_restClient: RestClient;
	readonly #_data: MessageUserLeaveData;

	/**
	 * Initializes a new instance of {@link MessageUserLeave}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: MessageUserLeaveData, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(MessageUserLeave, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, MessageUserLeaveData);
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
	 * Gets the id of the user who left the room.
	 * */
	public get userId()
	{
		return this.#_data.userId;
	}

	/**
	 * Gets the id of the room where the user moved to,
	 * or `null` if the user was not reallocated.
	 * */
	public get roomId()
	{
		return this.#_data.roomId;
	}

	/**
	 * Gets the id of the user who left the room.
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
	 * Gets the id of the room where the user moved to.
	 * @returns A promise that resolves to a {@link Room},
	 * or `null` if the user was not reallocated or the room no longer exists.
	 * */
	public async getRoom()
	{
		this.roomId !== null ? await this.restClient.getRoom(this.roomId) : null;
	}
}

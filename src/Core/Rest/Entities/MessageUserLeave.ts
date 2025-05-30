import { MessageUserLeaveData } from "./Models/MessageUserLeaveData";
import { SealedClassError } from "../../../Common/SealedClassError";
import { ThrowHelper } from "../../../Common/ThrowHelper";
import { RestClient } from "../RestClient";
import { UnreachableError } from "../../../Common/UnreachableError";
import { CancellationToken } from "../../../Common/Threading/CancellationToken";

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
		//ThrowHelper.TypeError.throwIfNotType(restClient, RestClient); // Circular dependency problem

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
	 * or `null` if the user was not relocated.
	 * */
	public get nextRoomId()
	{
		return this.#_data.nextRoomId;
	}

	/**
	 * Gets the id of the user who left the room.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link User}.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * */
	public async getUser(cancellationToken: CancellationToken = CancellationToken.none)
	{
		const user = await this.restClient.getUser(this.userId, cancellationToken);
		if (user === null)
		{
			throw new UnreachableError("User expected to exist, but the server sent nothing.");
		}

		return user;
	}

	/**
	 * Gets the id of the room where the user moved to.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Room},
	 * or `null` if the user was not relocated or the room no longer exists.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * */
	public async getRoom(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return this.nextRoomId !== null ? await this.restClient.getRoom(this.nextRoomId, cancellationToken) : null;
	}
}

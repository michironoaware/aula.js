import { SealedClassError } from "../../../Common/SealedClassError";
import { MessageUserJoinData } from "./Models/MessageUserJoinData";
import { ThrowHelper } from "../../../Common/ThrowHelper";
import { RestClient } from "../RestClient";
import { UnreachableError } from "../../../Common/UnreachableError";
import { CancellationToken } from "../../../Common/Threading/CancellationToken";

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
	 * Gets the id of the room where the user comes from,
	 * or `null` if the user did not come from any room.
	 * */
	public get previousRoomId()
	{
		return this.#_data.previousRoomId;
	}

	/**
	 * Gets the user who joined the room.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link User}.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
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
	 * Gets the room where the user comes from.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Room},
	 * or `null` if the user did not come from any room or the room no longer exists.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * */
	public async getPreviousRoom(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return this.previousRoomId !== null ? await this.restClient.getRoom(this.previousRoomId, cancellationToken) : null;
	}
}

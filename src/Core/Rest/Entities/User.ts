import { ThrowHelper } from "../../../Common/ThrowHelper";
import { RestClient } from "../RestClient";
import { UserData } from "./Models/UserData";
import { Permissions } from "./Permissions";
import { Room } from "./Room";
import { TypeHelper } from "../../../Common/TypeHelper";
import { UnreachableError } from "../../../Common/UnreachableError";
import { SetUserRoomRequestBody } from "../SetUserRoomRequestBody";
import { SetUserPermissionsRequestBody } from "../SetUserPermissionsRequestBody";
import { BanUserRequestBody } from "../BanUserRequestBody";
import { CancellationToken } from "../../../Common/Threading/CancellationToken";

/**
 * Represents a user within Aula.
 * */
export class User
{
	readonly #_restClient: RestClient;
	readonly #_data: UserData;

	/**
	 * Initializes a new instance of {@link User}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: UserData, restClient: RestClient)
	{
		ThrowHelper.TypeError.throwIfNotType(data, UserData);
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
	 * Gets the id of the user.
	 * */
	public get id()
	{
		return this.#_data.id;
	}

	/**
	 * Gets the display name of the user.
	 * */
	public get displayName()
	{
		return this.#_data.displayName;
	}

	/**
	 * Gets the description of the user.
	 * */
	public get description()
	{
		return this.#_data.description;
	}

	/**
	 * Gets the type of the user.
	 * */
	public get type()
	{
		return this.#_data.type;
	}

	/**
	 * Gets the connection state of the user.
	 * */
	public get presence()
	{
		return this.#_data.presence;
	}

	/**
	 * Gets the collection of role IDs of the user.
	 * */
	public get roleIds()
	{
		return this.#_data.roleIds;
	}

	/**
	 * Gets the id of the room the user currently resides in,
	 * or `null` if the user is not in any room.
	 * */
	public get currentRoomId()
	{
		return this.#_data.currentRoomId;
	}

	/**
	 * Gets the latest version of the user.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link User}.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * */
	public async getLatest(cancellationToken: CancellationToken = CancellationToken.none)
	{
		const user = await this.restClient.getUser(this.id, cancellationToken);
		if (user === null)
		{
			throw new UnreachableError("User expected to exist, but the server sent nothing.");
		}

		return user;
	}

	/**
	 * Gets the room where the user currently resides in.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Room},
	 * or `null` if the user is not in any room or the room no longer exists.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * */
	public async getCurrentRoom(cancellationToken: CancellationToken = CancellationToken.none)
	{
		if (this.currentRoomId === null)
		{
			return null;
		}

		return await this.restClient.getRoom(this.currentRoomId, cancellationToken);
	}

	/**
	 * Relocates the user to the specified room.
	 * @param room The id of the room, or `null` if the user should not be relocated.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * */
	public async setCurrentRoom(room: Room | string | null, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(room, Room, "string", "null");

		const roomId = TypeHelper.isType(room, Room) ? room.id : room ?? null;
		return await this.restClient.setUserRoom(this.id, new SetUserRoomRequestBody().withRoomId(roomId), cancellationToken);
	}

	/**
	 * Overwrites the permissions of the user.
	 * @param permissions The new permissions of the user.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * */
	public async setPermissions(permissions: Permissions, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(permissions, "bigint");
		return await this.restClient.setUserPermissions(
			this.id, new SetUserPermissionsRequestBody().withPermissions(permissions), cancellationToken);
	}

	/**
	 * Bans the user from the application.
	 * @param reason A text that provides context about why the action was performed.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link UserBan}, or `null` if the user is already banned.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * */
	public async ban(reason?: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(reason, "string", "undefined");
		return await this.restClient.banUser(
			this.id, reason !== undefined ? new BanUserRequestBody().withReason(reason) : undefined, cancellationToken);
	}

	/**
	 * Unbans the user from the application.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * */
	public async unban(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return await this.restClient.unbanUser(this.id, cancellationToken);
	}
}

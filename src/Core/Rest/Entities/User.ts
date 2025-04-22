import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { RestClient } from "../RestClient.js";
import { UserData } from "./Models/UserData.js";
import { Permissions } from "./Permissions.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { Room } from "./Room.js";
import { TypeHelper } from "../../../Common/TypeHelper.js";
import { UnreachableError } from "../../../Common/UnreachableError.js";
import { SetUserRoomRequestBody } from "../SetUserRoomRequestBody.js";
import { SetUserPermissionsRequestBody } from "../SetUserPermissionsRequestBody.js";
import { BanUserRequestBody } from "../BanUserRequestBody.js";
import { CancellationToken } from "../../../Common/Threading/index.js";

/**
 * Represents a user within Aula.
 * @sealed
 * */
export class User
{
	readonly #_restClient: RestClient;
	readonly #_data: UserData;
	#_permissions: Permissions | null = null;

	/**
	 * Initializes a new instance of {@link User}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: UserData, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(User, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, UserData);
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
	 * Gets the permissions of the user.
	 * */
	public get permissions()
	{
		return this.#_permissions ??= BigInt(this.#_data.permissions);
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

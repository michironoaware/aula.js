import { ThrowHelper } from "../../../Common/ThrowHelper";
import { RestClient } from "../RestClient";
import { UserData } from "./Models/UserData";
import { Room } from "./Room";
import { BanUserRequestBody } from "../BanUserRequestBody";
import { CancellationToken } from "../../../Common/Threading/CancellationToken";
import { ModifyUserRequestBody } from "../ModifyUserRequestBody";
import { Role } from "./Role";
import { TypeHelper } from "../../../Common/TypeHelper";

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
	 * Modifies the user.
	 * Requires {@link Permissions.SetCurrentRoom} to update the current room of a user other than the requester.
	 * Requires {@link Permissions.ManageRoles} to update the assigned roles.
	 * Fires an {@link UserUpdatedEvent} gateway event.
	 * @param body A {@link ModifyUserRequestBody} containing the properties to modify.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link User} that represents the modified user.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * @throws {AulaNotFoundError} If the user no longer exists.
	 * */
	public async modify(body: ModifyUserRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		return await this.restClient.modifyUser(this.id, body, cancellationToken);
	}

	/**
	 * Assigns a role to the user.
	 * Requires the {@link Permissions.ManageRoles} permission.
	 * Requires the {@link Permissions.Administrator} permission to assign roles above the higher role of the requester.
	 * Fires a {@link UserUpdatedEvent} gateway event.
	 * @param role The ID of the role to assign.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link User} that represents the updated user.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * @throws {AulaNotFoundError} If the user or the specified role does not exist.
	 * */
	public async assignRole(role: Role | string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(role, Role, "string");

		const roleId = TypeHelper.isType(role, Role) ? role.id : role;
		return await this.restClient.addRole(this.id, roleId, cancellationToken);
	}

	/**
	 * Revokes a role from the user.
	 * Requires the {@link Permissions.ManageRoles} permission.
	 * Requires the {@link Permissions.Administrator} permission to revoke roles above the higher role of the requester.
	 * Fires a {@link UserUpdatedEvent} gateway event.
	 * @param role The ID of the role to revoke.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link User} that represents the updated user.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * @throws {AulaNotFoundError} If the user or the specified role does not exist.
	 * */
	public async revokeRole(role: Role | string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(role, Role, "string");

		const roleId = TypeHelper.isType(role, Role) ? role.id : role;
		return await this.restClient.addRole(this.id, roleId, cancellationToken);
	}

	/**
	 * Gets the room where the user currently resides in.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Room},
	 * or `null` if the user is not in any room or the room no longer exists.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
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
	 * Ban the user from the service.
	 * Requires the {@link Permissions.BanUsers} permission.
	 * Fires a {@link BanIssuedEvent} gateway event.
	 * @param reason A text that provides context about why the action was performed.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link UserBan}, or `null` if the user is already banned.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * */
	public async ban(reason?: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(reason, "string", "undefined");
		return await this.restClient.banUser(
			this.id, reason !== undefined ? new BanUserRequestBody().withReason(reason) : undefined, cancellationToken);
	}

	/**
	 * Gets all the bans issued for the user.
	 * Requires the {@link Permissions.BanUsers} permission.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link UserBan} array.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * */
	public async getBans(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return await this.restClient.getUserBans(this.id, cancellationToken);
	}
}

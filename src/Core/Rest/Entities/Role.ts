import { RestClient } from "../RestClient";
import { RoleData } from "./Models/RoleData";
import { ThrowHelper } from "../../../Common/ThrowHelper";
import { ModifyRoleRequestBody } from "../ModifyRoleRequestBody";
import { CancellationToken } from "../../../Common/Threading/CancellationToken";

export class Role
{
	readonly #_restClient: RestClient;
	readonly #_data: RoleData;
	#_permissions: bigint | null = null;
	#_creationDate: Date | null = null;

	/**
	 * Initializes a new instance of {@link Role}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: RoleData, restClient: RestClient)
	{
		ThrowHelper.TypeError.throwIfNotType(data, RoleData);
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
	 * Gets the ID of the role.
	 * */
	public get id()
	{
		return this.#_data.id;
	}

	/**
	 * Gets the name of the role.
	 * */
	public get name()
	{
		return this.#_data.name;
	}

	/**
	 * Gets the permission bit flags of the role.
	 * */
	public get permissions()
	{
		return this.#_permissions ??= BigInt(this.#_data.permissions);
	}

	/**
	 * Gets the position of the role in the hierarchy.
	 * */
	public get position()
	{
		return this.#_data.position;
	}

	/**
	 * Gets whether the role is the global role.
	 * */
	public get isGlobal()
	{
		return this.#_data.isGlobal;
	}

	/**
	 * Gets the creation date of the role as a {@link Date} object.
	 * */
	public get creationDate()
	{
		return this.#_creationDate ??= new Date(this.#_data.creationDate);
	}

	/**
	 * Modifies this role.
	 * Requires authentication and the {@link Permissions.ManageRoles} permission.
	 * Requires the {@link Permissions.Administrator} permission to modify roles above the higher role of the requester.
	 * Fires a {@link RoleUpdatedEvent} gateway event.
	 * @param body A {@link ModifyRoleRequestBody} object containing the properties to modify.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Role} that represents the modified role.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * @throws {AulaNotFoundError} If the role no longer exists.
	 * */
	public async modify(body: ModifyRoleRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		return await this.restClient.modifyRole(this.id, body, cancellationToken);
	}

	/**
	 * Deletes this role.
	 * Requires authentication and the {@link Permissions.ManageRoles} permissions.
	 * Requires the {@link Permissions.Administrator} permission to delete roles above the higher role of the requester.
	 * Fires a {@link RoleDeletedEvent} gateway event.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaForbiddenError} If the user was not authorized to perform the action.
	 * */
	public async delete(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return await this.restClient.deleteRole(this.id, cancellationToken);
	}
}

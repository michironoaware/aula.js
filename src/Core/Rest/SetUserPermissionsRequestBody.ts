import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";
import { Permissions } from "./Entities/Permissions";

/**
 * Represents the request body used to override a user's permissions.
 * @sealed
 */
export class SetUserPermissionsRequestBody
{
	#_permissions: Permissions | null = null;

	/**
	 * Initializes a new instance of {@link SetUserPermissionsRequestBody}.
	 * */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(SetUserPermissionsRequestBody, new.target);
	}

	/**
	 * Gets the new permissions for the user.
	 * */
	public get permissions()
	{
		return this.#_permissions;
	}

	/**
	 * Sets the new permissions for the user.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param permissions The permission bit flags.
	 * */
	public set permissions(permissions: Permissions | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(permissions, "bigint", "null");
		this.#_permissions = permissions;
	}

	/**
	 * Sets the new permissions for the user.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param permissions The permission bit flags.
	 * @returns The current {@link SetUserPermissionsRequestBody} instance.
	 * */
	public withPermissions(permissions: Permissions | null)
	{
		this.permissions = permissions;
		return this;
	}

	public toJSON()
	{
		return { permissions: this.#_permissions };
	}
}

import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { Permissions } from "./Entities/Permissions.js";
import { InvalidOperationError } from "../../Common/InvalidOperationError.js";

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
	 * @param permissions The permission bit flags.
	 * */
	public set permissions(permissions: Permissions | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(permissions, "number", "null");
		this.#_permissions = permissions;
	}

	/**
	 * Sets the new permissions for the user.
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
		InvalidOperationError.throwIf(this.#_permissions === null, "The permissions must be provided first.");
		return { permissions: this.#_permissions };
	}
}

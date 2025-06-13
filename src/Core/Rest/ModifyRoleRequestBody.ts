import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";

/**
 * Represents the request body used to modify a role.
 * @sealed
 */
export class ModifyRoleRequestBody
{
	#_name: string | null = null;
	#_permissions: Permissions | null = null;

	/**
	 * Initializes a new instance of {@link ModifyRoleRequestBody}.
	 */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(ModifyRoleRequestBody, new.target);
	}

	/**
	 * Gets the name of the role to modify.
	 */
	public get name()
	{
		return this.#_name;
	}

	/**
	 * Sets the name of the role to modify.
	 * @param name The role name.
	 */
	public set name(name: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(name, "string", "null");
		this.#_name = name;
	}

	/**
	 * Gets the new permissions to assign to the role.
	 * */
	public get permissions()
	{
		return this.#_permissions;
	}

	/**
	 * Sets the new permissions to assign to the role.
	 * @param permissions The permission bit flags.
	 * */
	public set permissions(permissions: Permissions | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(permissions, "bigint", "null");
		this.#_permissions = permissions;
	}

	/**
	 * Sets the name of the role to modify.
	 * @param name The role name.
	 * @returns The current {@link ModifyRoleRequestBody} instance.
	 * */
	public withName(name: string | null)
	{
		this.name = name;
		return this;
	}

	/**
	 * Sets the new permissions to assign to the role.
	 * @param permissions The permission bit flags.
	 * @returns The current {@link ModifyRoleRequestBody} instance.
	 * */
	public withPermissions(permissions: Permissions | null)
	{
		this.permissions = permissions;
		return this;
	}

	public toJSON()
	{
		return { name: this.#_name, permissions: this.#_permissions } as unknown;
	}
}

import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";

/**
 * Represents the request body used to create a new role.
 * @sealed
 */
export class CreateRoleRequestBody
{
	#_name: string | null = null;
	#_permissions: Permissions | null = null;

	/**
	 * Initializes a new instance of {@link CreateRoleRequestBody}.
	 */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(CreateRoleRequestBody, new.target);
	}

	/**
	 * Gets the name of the role to create.
	 */
	public get name()
	{
		return this.#_name;
	}

	/**
	 * Sets the name of the role to create.
	 * @param name The role name.
	 */
	public set name(name: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(name, "string", "null");
		this.#_name = name;
	}

	/**
	 * Gets the permissions to assign to the role.
	 * */
	public get permissions()
	{
		return this.#_permissions;
	}

	/**
	 * Sets the permissions to assign to the role.
	 * @param permissions The permission bit flags.
	 * */
	public set permissions(permissions: Permissions | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(permissions, "bigint", "null");
		this.#_permissions = permissions;
	}

	/**
	 * Sets the name of the role to create.
	 * @param name The role name.
	 * @returns The current {@link CreateRoleRequestBody} instance.
	 * */
	public withName(name: string | null)
	{
		this.name = name;
		return this;
	}

	/**
	 * Sets the permissions to assign to the role.
	 * @param permissions The permission bit flags.
	 * @returns The current {@link CreateRoleRequestBody} instance.
	 * */
	public withPermissions(permissions: Permissions | null)
	{
		this.permissions = permissions;
		return this;
	}

	public toJSON()
	{
		return { name: this.#_name, permissions: this.#_permissions };
	}
}

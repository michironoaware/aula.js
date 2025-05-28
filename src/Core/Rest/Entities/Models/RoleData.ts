import { SealedClassError } from "../../../../Common/SealedClassError";
import { ThrowHelper } from "../../../../Common/ThrowHelper";

/**
 * Provides a strongly typed DTO class for the API v1 BanData JSON schema.
 * @sealed
 * @package
 * */
export class RoleData
{
	readonly #_id: string;
	readonly #_name: string;
	readonly #_permissions: string;
	readonly #_position: number;
	readonly #_isGlobal: boolean;
	readonly #_creationDate: string;

	/**
	 * Initializes a new instance of {@link RoleData}.
	 * @param data An object that conforms to the API v1 RoleData JSON schema
	 *             from where the data will be extracted.
	 * */
	constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(RoleData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.id, "string");
		ThrowHelper.TypeError.throwIfNotType(data.name, "string");
		ThrowHelper.TypeError.throwIfNotType(data.permissions, "string");
		ThrowHelper.TypeError.throwIfNotType(data.position, "number");
		ThrowHelper.TypeError.throwIfNotType(data.isGlobal, "boolean");
		ThrowHelper.TypeError.throwIfNotType(data.creationDate, "string");

		this.#_id = data.id;
		this.#_name = data.name;
		this.#_permissions = data.permissions;
		this.#_position = data.position;
		this.#_isGlobal = data.isGlobal;
		this.#_creationDate = data.creationDate;
	}

	/**
	 * Gets the ID of the role.
	 * */
	public get id()
	{
		return this.#_id;
	}

	/**
	 * Gets the name of the role.
	 * */
	public get name()
	{
		return this.#_name;
	}

	/**
	 * Gets the permission bit flags of the role.
	 * */
	public get permissions()
	{
		return this.#_permissions;
	}

	/**
	 * Gets the position of the role in the hierarchy.
	 * */
	public get position()
	{
		return this.#_position;
	}

	/**
	 * Gets whether the role is the global role.
	 * */
	public get isGlobal()
	{
		return this.#_isGlobal;
	}

	/**
	 * Gets the creation date of the role,
	 * expressed as a {@link https://en.wikipedia.org/wiki/ISO_8601 ISO 8601} string.
	 * */
	public get creationDate()
	{
		return this.#_creationDate;
	}
}

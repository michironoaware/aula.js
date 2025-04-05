import { UserType } from "../UserType.js";
import { Presence } from "../Presence.js";
import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../../Common/SealedClassError.js";

/**
 * Provides a strongly typed DTO class for the API v1 UserData JSON schema.
 * @package
 * */
export class UserData
{
	readonly #_id: string;
	readonly #_displayName: string;
	readonly #_description: string | null;
	readonly #_type: UserType;
	readonly #_presence: Presence;
	readonly #_permissions: string;
	readonly #_currentRoomId: string | null;

	/**
	 * Initializes a new instance of {@link UserData}.
	 * @param data An object that conforms to the API v1 UserData JSON schema
	 *             from where the data will be extracted.
	 * */
	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(UserData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.id, "string");
		ThrowHelper.TypeError.throwIfNotType(data.displayName, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(data.description, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotType(data.type, "number");
		ThrowHelper.TypeError.throwIfNotType(data.presence, "number");
		ThrowHelper.TypeError.throwIfNotType(data.permissions, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(data.currentRoomId, "string", "nullable");

		this.#_id = data.id;
		this.#_displayName = data.displayName;
		this.#_description = data.description ?? null;
		this.#_type = data.type;
		this.#_presence = data.presence;
		this.#_permissions = data.permissions;
		this.#_currentRoomId = data.currentRoomId ?? null;
	}

	/**
	 * The id of the user.
	 * */
	public get id()
	{
		return this.#_id;
	}

	/**
	 * The display name of the user.
	 * */
	public get displayName()
	{
		return this.#_displayName;
	}

	/**
	 * The description of the user.
	 * */
	public get description()
	{
		return this.#_description;
	}

	/**
	 * The type of user.
	 * */
	public get type()
	{
		return this.#_type;
	}

	/**
	 * The connection state of the user.
	 * */
	public get presence()
	{
		return this.#_presence;
	}

	/**
	 * The permission bit fields of the user as a string.
	 * */
	public get permissions()
	{
		return this.#_permissions;
	}

	/**
	 * The id of the room where the user is located.
	 * */
	public get currentRoomId()
	{
		return this.#_currentRoomId;
	}
}

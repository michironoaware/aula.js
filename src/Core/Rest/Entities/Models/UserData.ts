import { UserType } from "../UserType";
import { Presence } from "../Presence";
import { ThrowHelper } from "../../../../Common/ThrowHelper";
import { SealedClassError } from "../../../../Common/SealedClassError";

/**
 * Provides a strongly typed DTO class for the API v1 UserData JSON schema.
 * @sealed
 * @package
 * */
export class UserData
{
	readonly #_id: string;
	readonly #_displayName: string;
	readonly #_description: string;
	readonly #_type: UserType;
	readonly #_presence: Presence;
	readonly #_roleIds: ReadonlyArray<string>;
	readonly #_currentRoomId: string | null;

	/**
	 * Initializes a new instance of {@link UserData}.
	 * @param data An object that conforms to the API v1 UserData JSON schema
	 *             from where the data will be extracted.
	 * */
	public constructor(
		data: {
			id: string;
			displayName: string;
			description: string;
			type: number;
			presence: number;
			roleIds: Iterable<string>;
			currentRoomId: string | null | undefined;
		})
	{
		SealedClassError.throwIfNotEqual(UserData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.id, "string");
		ThrowHelper.TypeError.throwIfNotType(data.displayName, "string");
		ThrowHelper.TypeError.throwIfNotType(data.description, "string");
		ThrowHelper.TypeError.throwIfNotType(data.type, "number");
		ThrowHelper.TypeError.throwIfNotType(data.presence, "number");
		ThrowHelper.TypeError.throwIfNotType(data.roleIds, "iterable");
		ThrowHelper.TypeError.throwIfNotAnyType(data.currentRoomId, "string", "nullable");

		const roleIds = Object.freeze([ ...data.roleIds ]);
		ThrowHelper.TypeError.throwIfNotTypeArray(roleIds, "string");

		this.#_id = data.id;
		this.#_displayName = data.displayName;
		this.#_description = data.description;
		this.#_type = data.type;
		this.#_presence = data.presence;
		this.#_roleIds = roleIds;
		this.#_currentRoomId = data.currentRoomId ?? null;
	}

	/**
	 * Gets the id of the user.
	 * */
	public get id()
	{
		return this.#_id;
	}

	/**
	 * Gets the display name of the user.
	 * */
	public get displayName()
	{
		return this.#_displayName;
	}

	/**
	 * Gets the description of the user.
	 * */
	public get description()
	{
		return this.#_description;
	}

	/**
	 * Gets the type of user.
	 * */
	public get type()
	{
		return this.#_type;
	}

	/**
	 * Gets the connection state of the user.
	 * */
	public get presence()
	{
		return this.#_presence;
	}

	/**
	 * Gets the collection of role IDs of the user.
	 * */
	public get roleIds()
	{
		return this.#_roleIds;
	}

	/**
	 * Gets the id of the room where the user is located.
	 * */
	public get currentRoomId()
	{
		return this.#_currentRoomId;
	}
}

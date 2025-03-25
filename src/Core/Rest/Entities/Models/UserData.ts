import { UserType } from "../UserType.js";
import { Presence } from "../Presence.js";
import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../../Common/SealedClassError.js";

export class UserData
{
	readonly #_id: string;
	readonly #_displayName: string;
	readonly #_description: string | null;
	readonly #_type: UserType;
	readonly #_presence: Presence;
	readonly #_permissions: string;
	readonly #_currentRoomId: string | null;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(UserData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.id, "string");
		ThrowHelper.TypeError.throwIfNotType(data.displayName, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(data.description, "string", "null", "undefined");
		ThrowHelper.TypeError.throwIfNotType(data.type, "number");
		ThrowHelper.TypeError.throwIfNotType(data.presence, "number");
		ThrowHelper.TypeError.throwIfNotType(data.permissions, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(data.currentRoomId, "string", "null", "undefined");

		this.#_id = data.id;
		this.#_displayName = data.displayName;
		this.#_description = data.description ?? null;
		this.#_type = data.type;
		this.#_presence = data.presence;
		this.#_permissions = data.permissions;
		this.#_currentRoomId = data.currentRoomId ?? null;
	}

	public get id()
	{
		return this.#_id;
	}

	public get displayName()
	{
		return this.#_displayName;
	}

	public get description()
	{
		return this.#_description;
	}

	public get type()
	{
		return this.#_type;
	}

	public get presence()
	{
		return this.#_presence;
	}

	public get permissions()
	{
		return this.#_permissions;
	}

	public get currentRoomId()
	{
		return this.#_currentRoomId;
	}

}

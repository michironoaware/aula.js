import {UserType} from "../UserType.js";
import {Presence} from "../Presence.js";
import {Permissions} from "../Permissions.js";
import {ThrowHelper} from "../../../Common/ThrowHelper.js";
import {SealedClassError} from "../../../Common/SealedClassError.js";

export class UserData
{
	readonly #id: string;
	readonly #displayName: string;
	readonly #description: string | null;
	readonly #type: UserType;
	readonly #presence: Presence;
	readonly #permissions: Permissions;
	readonly #currentRoomId: string | null;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(UserData, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, "object");
		ThrowHelper.TypeError.throwIfNotType(data.id, "string");
		ThrowHelper.TypeError.throwIfNotType(data.displayName, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(data.description, "string", "null", "undefined");
		ThrowHelper.TypeError.throwIfNotType(data.type, "number");
		ThrowHelper.TypeError.throwIfNotType(data.presence, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(data.currentRoomId, "string", "null", "undefined");

		this.#id = data.id;
		this.#displayName = data.displayName;
		this.#description = data.description ?? null;
		this.#type = data.type;
		this.#presence = data.presence;
		this.#permissions = data.permissions;
		this.#currentRoomId = data.currentRoomId ?? null;
	}

	public get id()
	{
		return this.#id;
	}

	public get displayName()
	{
		return this.#displayName;
	}


	public get description()
	{
		return this.#description;
	}

	public get type()
	{
		return this.#type;
	}

	public get presence()
	{
		return this.#presence;
	}

	public get permissions()
	{
		return this.#permissions;
	}

	public get currentRoomId()
	{
		return this.#currentRoomId;
	}

}

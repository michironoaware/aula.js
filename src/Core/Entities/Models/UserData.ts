import {UserType} from "../UserType.js";
import {Presence} from "../Presence.js";
import {Permissions} from "../Permissions.js";
import {ThrowHelper} from "../../../Common/ThrowHelper.js";

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
		ThrowHelper.TypeError.throwIfNotType(data.id, "string");
		ThrowHelper.TypeError.throwIfNotType(data.displayName, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(data.description, "string", "null");
		ThrowHelper.TypeError.throwIfNotType(data.type, UserType);
		ThrowHelper.TypeError.throwIfNotType(data.presence, Presence);
		ThrowHelper.TypeError.throwIfNotAnyType(data.currentRoomId, "string", "null");

		this.#id = data.id;
		this.#displayName = data.displayName;
		this.#description = data.description;
		this.#type = data.type;
		this.#presence = data.presence;
		this.#permissions = data.permissions;
		this.#currentRoomId = data.currentRoomId;
	}

	get id()
	{
		return this.#id;
	}

	get displayName()
	{
		return this.#displayName;
	}


	get description()
	{
		return this.#description;
	}

	get type()
	{
		return this.#type;
	}

	get presence()
	{
		return this.#presence;
	}

	get permissions()
	{
		return this.#permissions;
	}

	get currentRoomId()
	{
		return this.#currentRoomId;
	}

}

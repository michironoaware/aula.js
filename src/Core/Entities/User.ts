import {ThrowHelper} from "../../Common/ThrowHelper.js";
import {RestClient} from "../Rest/RestClient.js";
import {UserData} from "./Models/UserData.js";
import {UserType} from "./UserType.js";
import {Permissions} from "./Permissions.js";
import {Presence} from "./Presence.js";

export class User
{
	readonly #client: RestClient;
	readonly #data: UserData;

	public constructor(client: RestClient, data: UserData)
	{
		ThrowHelper.TypeError.throwIfNotType(client, RestClient);
		ThrowHelper.TypeError.throwIfNull(data);

		this.#client = client;
		this.#data = data;
	}

	public get id(): string
	{
		return this.#data.id;
	}

	public get displayName(): string
	{
		return this.#data.displayName;
	}

	public get description(): string | null
	{
		return this.#data.description;
	}

	public get type(): UserType
	{
		return this.#data.type;
	}

	public get presence(): Presence
	{
		return this.#data.presence;
	}

	public get permissions(): Permissions
	{
		return this.#data.permissions;
	}

	public get currentRoomId(): string | null
	{
		return this.#data.currentRoomId;
	}
}
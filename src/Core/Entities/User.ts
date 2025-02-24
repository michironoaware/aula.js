import {ThrowHelper} from "../../Common/ThrowHelper.js";
import {RestClient} from "../Rest/RestClient.js";
import {UserData} from "./Models/UserData.js";
import {UserType} from "./UserType.js";
import {Permissions} from "./Permissions.js";
import {Presence} from "./Presence.js";

export class User
{
	readonly #restClient: RestClient;
	readonly #data: UserData;

	public constructor(restClient: RestClient, data: UserData)
	{
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);
		ThrowHelper.TypeError.throwIfNotType(data, UserData);

		this.#restClient = restClient;
		this.#data = data;
	}

	public get restClient()
	{
		return this.#restClient;
	}

	public get id()
	{
		return this.#data.id;
	}

	public get displayName()
	{
		return this.#data.displayName;
	}

	public get description()
	{
		return this.#data.description;
	}

	public get type()
	{
		return this.#data.type;
	}

	public get presence()
	{
		return this.#data.presence;
	}

	public get permissions()
	{
		return this.#data.permissions;
	}

	public get currentRoomId()
	{
		return this.#data.currentRoomId;
	}
}
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { RestClient } from "../Rest/RestClient.js";
import { UserData } from "./Models/UserData.js";
import { Permissions } from "./Permissions.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { Room } from "./Room.js";
import { TypeHelper } from "../../Common/TypeHelper.js";

export class User
{
	readonly #restClient: RestClient;
	readonly #data: UserData;

	public constructor(restClient: RestClient, data: UserData)
	{
		SealedClassError.throwIfNotEqual(User, new.target);
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

	public async getLatest()
	{
		return await this.#restClient.getUser(this.#data.id);
	}

	public async getCurrentRoom()
	{
		if (this.currentRoomId === null)
		{
			return null;
		}

		return await this.#restClient.getRoom(this.currentRoomId);
	}

	public async setCurrentRoom(room: Room): Promise<void>;

	public async setCurrentRoom(roomId: string): Promise<void>;

	public async setCurrentRoom(room: Room | string)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(room, Room, "string");

		const roomId = TypeHelper.isType(room, Room) ? room.id : room;
		return await this.#restClient.setUserRoom(this.#data.id, { roomId });
	}

	public async setPermissions(permissions: Permissions)
	{
		ThrowHelper.TypeError.throwIfNotType(permissions, "number");
		return await this.#restClient.setUserPermissions(this.#data.id, { permissions });
	}

	public async ban(reason: string)
	{
		ThrowHelper.TypeError.throwIfNotType(reason, "string");
		return await this.#restClient.banUser(this.#data.id, { reason });
	}

	public async unban()
	{
		return await this.#restClient.unbanUser(this.#data.id);
	}
}

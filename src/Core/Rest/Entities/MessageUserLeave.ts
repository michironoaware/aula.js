import { MessageUserLeaveData } from "./Models/MessageUserLeaveData.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { RestClient } from "../RestClient.js";
import { UnreachableError } from "../../../Common/UnreachableError.js";

export class MessageUserLeave
{
	readonly #_restClient: RestClient;
	readonly #_data: MessageUserLeaveData;

	public constructor(data: MessageUserLeaveData, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(MessageUserLeave, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, MessageUserLeaveData);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

		this.#_restClient = restClient;
		this.#_data = data;
	}

	public get restClient()
	{
		return this.#_restClient;
	}

	public get userId()
	{
		return this.#_data.userId;
	}

	public get roomId()
	{
		return this.#_data.roomId;
	}

	public async getUser()
	{
		const user = await this.restClient.getUser(this.userId);
		if (user === null)
		{
			throw new UnreachableError("User expected to exist, but the server sent nothing.");
		}

		return user;
	}

	public async getRoom()
	{
		this.roomId !== null ? await this.restClient.getRoom(this.roomId) : null;
	}
}

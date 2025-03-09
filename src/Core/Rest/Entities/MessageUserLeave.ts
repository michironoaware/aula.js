import { MessageUserLeaveData } from "./Models/MessageUserLeaveData.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { RestClient } from "../RestClient.js";

export class MessageUserLeave
{
	readonly #restClient: RestClient;
	readonly #data: MessageUserLeaveData;

	public constructor(restClient: RestClient, data: MessageUserLeaveData)
	{
		SealedClassError.throwIfNotEqual(MessageUserLeave, new.target);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);
		ThrowHelper.TypeError.throwIfNotType(data, MessageUserLeaveData);

		this.#restClient = restClient;
		this.#data = data;
	}

	public get restClient()
	{
		return this.#restClient;
	}

	public get userId()
	{
		return this.#data.userId;
	}

	public get roomId()
	{
		return this.#data.roomId;
	}

	public async getUser()
	{
		return await this.restClient.getUser(this.userId);
	}

	public async getRoom()
	{
		if (this.roomId === null)
		{
			return null;
		}

		return await this.restClient.getRoom(this.roomId);
	}
}

import { SealedClassError } from "../../../Common/SealedClassError.js";
import { MessageUserJoinData } from "./Models/MessageUserJoinData.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { RestClient } from "../RestClient.js";

export class MessageUserJoin
{
	readonly #restClient: RestClient;
	readonly #data: MessageUserJoinData;

	public constructor(data: MessageUserJoinData, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(MessageUserJoin, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, MessageUserJoinData);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

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

	public async getUser()
	{
		return await this.restClient.getUser(this.userId);
	}
}

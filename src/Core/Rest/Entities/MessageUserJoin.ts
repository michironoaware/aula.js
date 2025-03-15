import { SealedClassError } from "../../../Common/SealedClassError.js";
import { MessageUserJoinData } from "./Models/MessageUserJoinData.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { RestClient } from "../RestClient.js";

export class MessageUserJoin
{
	readonly #_restClient: RestClient;
	readonly #_data: MessageUserJoinData;

	public constructor(data: MessageUserJoinData, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(MessageUserJoin, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, MessageUserJoinData);
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

	public async getUser()
	{
		return await this.restClient.getUser(this.userId);
	}
}

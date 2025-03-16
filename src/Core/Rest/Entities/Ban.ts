import { RestClient } from "../RestClient.js";
import { BanData } from "./Models/BanData.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";

export class Ban
{
	readonly #_restClient: RestClient;
	readonly #_data: BanData;
	#_creationDate: Date | null = null;

	public constructor(data: BanData, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(Ban, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, BanData);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

		this.#_restClient = restClient;
		this.#_data = data;
	}

	get restClient()
	{
		return this.#_restClient;
	}

	get type()
	{
		return this.#_data.type;
	}

	get executorId()
	{
		return this.#_data.executorId;
	}

	get reason()
	{
		return this.#_data.reason;
	}

	get targetId()
	{
		return this.#_data.targetId;
	}

	get creationDate()
	{
		return this.#_creationDate ??= new Date(this.#_data.creationDate);
	}

	public async getExecutor()
	{
		if (this.executorId === null)
		{
			return null;
		}

		return await this.restClient.getUser(this.executorId);
	}

	public async getTarget()
	{
		if (this.targetId === null)
		{
			return null;
		}

		return await this.restClient.getUser(this.targetId);
	}
}

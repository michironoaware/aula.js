import { RestClient } from "../RestClient.js";
import { BanData } from "./Models/BanData.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { Temporal } from "@js-temporal/polyfill";
import { SealedClassError } from "../../../Common/SealedClassError.js";

export class Ban
{
	readonly #restClient: RestClient;
	readonly #data: BanData;

	public constructor(restClient: RestClient, data: BanData)
	{
		SealedClassError.throwIfNotEqual(Ban, new.target);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);
		ThrowHelper.TypeError.throwIfNotType(data, BanData);

		this.#restClient = restClient;
		this.#data = data;
	}

	get restClient()
	{
		return this.#restClient;
	}

	get type()
	{
		return this.#data.type;
	}

	get executorId()
	{
		return this.#data.executorId;
	}

	get reason()
	{
		return this.#data.reason;
	}

	get targetId()
	{
		return this.#data.targetId;
	}

	get creationTime()
	{
		return Temporal.Instant.from(this.#data.creationDate);
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

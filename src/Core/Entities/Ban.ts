import {RestClient} from "../Rest/RestClient.js";
import {BanData} from "./Models/BanData.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";
import {Temporal} from "@js-temporal/polyfill";

export class Ban
{
	readonly #restClient: RestClient;
	readonly #data: BanData;

	public constructor(restClient: RestClient, data: BanData)
	{
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
		return Temporal.Instant.from(this.#data.creationTime);
	}
}

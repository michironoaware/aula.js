import {RestClient} from "../Rest/RestClient.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";
import {MessageData} from "./Models/MessageData.js";
import {Temporal} from "@js-temporal/polyfill";

export class Message
{
	readonly #restClient: RestClient;
	readonly #data: MessageData;

	public constructor(restClient: RestClient, data: MessageData)
	{
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);
		ThrowHelper.TypeError.throwIfNotType(data, MessageData);

		this.#restClient = restClient;
		this.#data = data;
	}

	public get restClient()
	{
		return this.#restClient;
	}

	get id()
	{
		return this.#data.id;
	}

	get type()
	{
		return this.#data.type;
	}

	get flags()
	{
		return this.#data.flags;
	}

	get authorType()
	{
		return this.#data.authorType;
	}

	get authorId()
	{
		return this.#data.authorId;
	}

	get roomId()
	{
		return this.#data.roomId;
	}

	get content()
	{
		return this.#data.content;
	}

	get joinData()
	{
		return this.#data.joinData;
	}

	get leaveData()
	{
		return this.#data.leaveData;
	}

	get creationTime()
	{
		return Temporal.PlainDateTime.from(this.#data.creationTime);
	}
}

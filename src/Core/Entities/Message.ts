import { RestClient } from "../Rest/RestClient.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { MessageData } from "./Models/MessageData.js";
import { Temporal } from "@js-temporal/polyfill";
import { SealedClassError } from "../../Common/SealedClassError.js";

export class Message
{
	readonly #restClient: RestClient;
	readonly #data: MessageData;

	public constructor(restClient: RestClient, data: MessageData)
	{
		SealedClassError.throwIfNotEqual(Message, new.target);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);
		ThrowHelper.TypeError.throwIfNotType(data, MessageData);

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

	public get type()
	{
		return this.#data.type;
	}

	public get flags()
	{
		return this.#data.flags;
	}

	public get authorType()
	{
		return this.#data.authorType;
	}

	public get authorId()
	{
		return this.#data.authorId;
	}

	public get roomId()
	{
		return this.#data.roomId;
	}

	public get content()
	{
		return this.#data.content;
	}

	public get joinData()
	{
		return this.#data.joinData;
	}

	public get leaveData()
	{
		return this.#data.leaveData;
	}

	public get creationTime()
	{
		return Temporal.ZonedDateTime.from(this.#data.creationTime);
	}
}

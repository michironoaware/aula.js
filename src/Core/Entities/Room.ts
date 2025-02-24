import {RestClient} from "../Rest/RestClient.js";
import {RoomData} from "./Models/RoomData.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";
import {Temporal} from "@js-temporal/polyfill";

export class Room
{
	readonly #client: RestClient;
	readonly #data: RoomData;
	public constructor(client: RestClient, data: RoomData)
	{
		ThrowHelper.TypeError.throwIfNotType(client, RestClient);
		ThrowHelper.TypeError.throwIfNotType(data, RoomData);

		this.#client = client;
		this.#data = data;
	}

	get id()
	{
		return this.#data.id;
	}

	get name()
	{
		return this.#data.name;
	}

	get description()
	{
		return this.#data.description;
	}

	get isEntrance()
	{
		return this.#data.isEntrance;
	}

	get connectedRoomIds()
	{
		return this.#data.connectedRoomIds;
	}

	get creationTime(): Temporal.PlainDateTime
	{
		return Temporal.PlainDateTime.from(this.#data.creationTime);
	}
}

import {RestClient} from "../Rest/RestClient.js";
import {RoomData} from "./Models/RoomData.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";
import {Temporal} from "@js-temporal/polyfill";
import {SealedClassError} from "../../Common/SealedClassError.js";

export class Room
{
	readonly #restClient: RestClient;
	readonly #data: RoomData;
	public constructor(restClient: RestClient, data: RoomData)
	{
		SealedClassError.throwIfNotEqual(Room, new.target);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);
		ThrowHelper.TypeError.throwIfNotType(data, RoomData);

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

	public get name()
	{
		return this.#data.name;
	}

	public get description()
	{
		return this.#data.description;
	}

	public get isEntrance()
	{
		return this.#data.isEntrance;
	}

	public get connectedRoomIds()
	{
		return this.#data.connectedRoomIds;
	}

	public get creationTime()
	{
		return Temporal.ZonedDateTime.from(this.#data.creationTime);
	}
}

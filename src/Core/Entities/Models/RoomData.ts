import {ThrowHelper} from "../../../Common/ThrowHelper.js";

export class RoomData
{
	readonly #id: string;
	readonly #name: string;
	readonly #description: string | null;
	readonly #isEntrance: boolean;
	readonly #connectedRoomIds: ReadonlyArray<string>;
	readonly #creationTime: string;

	public constructor(data: any)
	{
		ThrowHelper.TypeError.throwIfNull(data);
		ThrowHelper.TypeError.throwIfNotType(data.id, "string");
		ThrowHelper.TypeError.throwIfNotType(data.name, "string");
		ThrowHelper.TypeError.throwIfNotType(data.description, "string");
		ThrowHelper.TypeError.throwIfNotType(data.isEntrance, "boolean");
		ThrowHelper.TypeError.throwIfNotType(data.connectedRoomIds, Array<string>);
		for (const id of data.roomIds)
		{
			ThrowHelper.TypeError.throwIfNotType(id, "string")
		}
		ThrowHelper.TypeError.throwIfNotType(data.creationTime, "string");

		this.#id = data.id;
		this.#name = data.name;
		this.#description = data.description;
		this.#isEntrance = data.isEntrance;
		this.#connectedRoomIds = data.connectedRoomIds;
		this.#creationTime = data.creationTime;
	}

	get id()
	{
		return this.#id;
	}

	get name()
	{
		return this.#name;
	}

	get description()
	{
		return this.#description;
	}

	get isEntrance()
	{
		return this.#isEntrance;
	}

	get connectedRoomIds()
	{
		return this.#connectedRoomIds;
	}

	get creationTime()
	{
		return this.#creationTime;
	}
}

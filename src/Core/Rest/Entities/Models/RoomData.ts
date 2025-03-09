import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../../Common/SealedClassError.js";

export class RoomData
{
	readonly #id: string;
	readonly #name: string;
	readonly #description: string | null;
	readonly #isEntrance: boolean;
	readonly #connectedRoomIds: ReadonlyArray<string>;
	readonly #creationDate: string;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(RoomData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.id, "string");
		ThrowHelper.TypeError.throwIfNotType(data.name, "string");
		ThrowHelper.TypeError.throwIfNotType(data.description, "string");
		ThrowHelper.TypeError.throwIfNotType(data.isEntrance, "boolean");
		ThrowHelper.TypeError.throwIfNotType(data.connectedRoomIds, "iterable");
		ThrowHelper.TypeError.throwIfNotType(data.creationDate, "string");

		const connectedRoomIds = Object.freeze([ ...data.connectedRoomIds ]);
		for (const roomId of connectedRoomIds)
		{
			ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		}

		this.#id = data.id;
		this.#name = data.name;
		this.#description = data.description;
		this.#isEntrance = data.isEntrance;
		this.#connectedRoomIds = connectedRoomIds;
		this.#creationDate = data.creationDate;
	}

	public get id()
	{
		return this.#id;
	}

	public get name()
	{
		return this.#name;
	}

	public get description()
	{
		return this.#description;
	}

	public get isEntrance()
	{
		return this.#isEntrance;
	}

	public get connectedRoomIds()
	{
		return this.#connectedRoomIds;
	}

	public get creationDate()
	{
		return this.#creationDate;
	}
}

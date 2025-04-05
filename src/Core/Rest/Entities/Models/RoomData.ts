import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../../Common/SealedClassError.js";

export class RoomData
{
	readonly #_id: string;
	readonly #_type: number;
	readonly #_name: string;
	readonly #_description: string | null;
	readonly #_isEntrance: boolean;
	readonly #_backgroundAudioId: string | null;
	readonly #_connectedRoomIds: ReadonlyArray<string>;
	readonly #_creationDate: string;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(RoomData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.type, "number");
		ThrowHelper.TypeError.throwIfNotType(data.id, "string");
		ThrowHelper.TypeError.throwIfNotType(data.name, "string");
		ThrowHelper.TypeError.throwIfNotType(data.description, "string");
		ThrowHelper.TypeError.throwIfNotType(data.isEntrance, "boolean");
		ThrowHelper.TypeError.throwIfNotAnyType(data.backgroundAudioId, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotType(data.connectedRoomIds, "iterable");
		ThrowHelper.TypeError.throwIfNotType(data.creationDate, "string");

		const connectedRoomIds = Object.freeze([ ...data.connectedRoomIds ]);
		ThrowHelper.TypeError.throwIfNotTypeArray(connectedRoomIds, "string");

		this.#_id = data.id;
		this.#_type = data.type;
		this.#_name = data.name;
		this.#_description = data.description;
		this.#_isEntrance = data.isEntrance;
		this.#_backgroundAudioId = data.backgroundAudioId ?? null;
		this.#_connectedRoomIds = connectedRoomIds;
		this.#_creationDate = data.creationDate;
	}

	public get id()
	{
		return this.#_id;
	}

	public get type()
	{
		return this.#_type;
	}

	public get name()
	{
		return this.#_name;
	}

	public get description()
	{
		return this.#_description;
	}

	public get isEntrance()
	{
		return this.#_isEntrance;
	}

	public get backgroundAudioId()
	{
		return this.#_backgroundAudioId;
	}

	public get connectedRoomIds()
	{
		return this.#_connectedRoomIds;
	}

	public get creationDate()
	{
		return this.#_creationDate;
	}
}

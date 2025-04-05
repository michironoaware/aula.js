import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../../Common/SealedClassError.js";

/**
 * Provides a strongly typed DTO class for the API v1 RoomData JSON schema.
 * @package
 * */
export class RoomData
{
	readonly #_id: string;
	readonly #_type: number;
	readonly #_name: string;
	readonly #_description: string;
	readonly #_isEntrance: boolean;
	readonly #_backgroundAudioId: string | null;
	readonly #_connectedRoomIds: ReadonlyArray<string>;
	readonly #_creationDate: string;

	/**
	 * Initializes a new instance of {@link RoomData}.
	 * @param data An object that conforms to the API v1 RoomData JSON schema
	 *             from where the data will be extracted.
	 * */
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

	/**
	 * The id of the room.
	 * */
	public get id()
	{
		return this.#_id;
	}

	/**
	 * The type of the room.
	 * */
	public get type()
	{
		return this.#_type;
	}

	/**
	 * The name of the room.
	 * */
	public get name()
	{
		return this.#_name;
	}

	/**
	 * The description of the room.
	 * */
	public get description()
	{
		return this.#_description;
	}

	/**
	 * Whether a user can enter this room without coming from any other room.
	 * */
	public get isEntrance()
	{
		return this.#_isEntrance;
	}

	/**
	 * The file id of the background audio associated with this room.
	 * */
	public get backgroundAudioId()
	{
		return this.#_backgroundAudioId;
	}

	/**
	 * A collection of ids of the rooms that a user can travel to from this room.
	 * */
	public get connectedRoomIds()
	{
		return this.#_connectedRoomIds;
	}

	/**
	 * Gets the creation date of the room,
	 * expressed as a {@link https://en.wikipedia.org/wiki/ISO_8601 ISO 8601} string.
	 * */
	public get creationDate()
	{
		return this.#_creationDate;
	}
}

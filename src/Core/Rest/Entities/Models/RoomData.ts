﻿import { ThrowHelper } from "../../../../Common/ThrowHelper";
import { SealedClassError } from "../../../../Common/SealedClassError";

/**
 * Provides a strongly typed DTO class for the API v1 RoomData JSON schema.
 * @sealed
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
	readonly #_residentIds: ReadonlyArray<string>;
	readonly #_destinationIds: ReadonlyArray<string>;
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
		ThrowHelper.TypeError.throwIfNotType(data.residentIds, "iterable");
		ThrowHelper.TypeError.throwIfNotType(data.destinationIds, "iterable");
		ThrowHelper.TypeError.throwIfNotType(data.creationDate, "string");

		const residentIds = Object.freeze([ ...data.residentIds ]);
		ThrowHelper.TypeError.throwIfNotTypeArray(residentIds, "string");
		const destinationIds = Object.freeze([ ...data.destinationIds ]);
		ThrowHelper.TypeError.throwIfNotTypeArray(destinationIds, "string");

		this.#_id = data.id;
		this.#_type = data.type;
		this.#_name = data.name;
		this.#_description = data.description;
		this.#_isEntrance = data.isEntrance;
		this.#_backgroundAudioId = data.backgroundAudioId ?? null;
		this.#_residentIds = residentIds;
		this.#_destinationIds = destinationIds;
		this.#_creationDate = data.creationDate;
	}

	/**
	 * Gets the id of the room.
	 * */
	public get id()
	{
		return this.#_id;
	}

	/**
	 * Gets the type of the room.
	 * */
	public get type()
	{
		return this.#_type;
	}

	/**
	 * Gets the name of the room.
	 * */
	public get name()
	{
		return this.#_name;
	}

	/**
	 * Gets the description of the room.
	 * */
	public get description()
	{
		return this.#_description;
	}

	/**
	 * Gets whether a user can enter this room without coming from any other room.
	 * */
	public get isEntrance()
	{
		return this.#_isEntrance;
	}

	/**
	 * Gets the file id of the background audio associated with this room.
	 * */
	public get backgroundAudioId()
	{
		return this.#_backgroundAudioId;
	}

	/**
	 * Gets the collection of IDs of users currently in the room.
	 * */
	public get residentIds()
	{
		return this.#_residentIds;
	}

	/**
	 * Gets the collection of ids of the rooms that a user can travel to from this room.
	 * */
	public get destinationIds()
	{
		return this.#_destinationIds;
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

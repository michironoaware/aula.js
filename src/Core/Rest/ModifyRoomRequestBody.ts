﻿import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";
import { ReadOnlyCollection } from "../../Common/Collections/ReadOnlyCollection";
import { TypeHelper } from "../../Common/TypeHelper";
import { ArrayHelper } from "../../Common/ArrayHelper";

/**
 * Represents the request body used to modify a room.
 * @sealed
 */
export class ModifyRoomRequestBody
{
	#_name: string | null = null;
	#_description: string | null = null;
	#_isEntrance: boolean | null = null;
	#_backgroundAudioId: string | null = null;
	#_destinationIds: string[] | null = null;
	#_destinationIdsView: ReadOnlyCollection<string> | null = null;

	/**
	 * Initializes a new instance of {@link ModifyRoomRequestBody}.
	 */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(ModifyRoomRequestBody, new.target);
	}

	/**
	 * Gets the new name of the room.
	 */
	public get name()
	{
		return this.#_name;
	}

	/**
	 * Sets the new name of the room.
	 * @param name The room name, or `null` to do no modifications.
	 */
	public set name(name: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(name, "string", "null");
		this.#_name = name;
	}

	/**
	 * Gets the new description of the room.
	 */
	public get description()
	{
		return this.#_description;
	}

	/**
	 * Sets the new description of the room.
	 * @param description The room description, or `null` to do no modifications.
	 */
	public set description(description: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(description, "string", "null");
		this.#_description = description;
	}

	/**
	 * Gets whether users with no room should be able to enter the room.
	 */
	public get isEntrance()
	{
		return this.#_isEntrance;
	}

	/**
	 * Sets whether users with no room should be able to enter the room.
	 * @param isEntrance Indicates if the room should be an entrance, or `null` to do no modifications.
	 */
	public set isEntrance(isEntrance: boolean | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(isEntrance, "boolean", "null");
		this.#_isEntrance = isEntrance;
	}

	/**
	 * Gets the id of the audio file to associate with the room.
	 */
	public get backgroundAudioId()
	{
		return this.#_backgroundAudioId;
	}

	/**
	 * Sets the id of the audio file to associate with the room.
	 * @param backgroundAudioId The file id, or `null` to do no modifications.
	 */
	public set backgroundAudioId(backgroundAudioId: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(backgroundAudioId, "string", "null");
		this.#_backgroundAudioId = backgroundAudioId;
	}

	/**
	 * Gets the ID collection of the destination rooms that will overwrite the current destination room values,
	 * or `null` if no overwrites have been specified.
	 * */
	public get destinationIds()
	{
		if (this.#_destinationIds === null)
		{
			return null;
		}

		return this.#_destinationIdsView ??= new ReadOnlyCollection(this.#_destinationIds);
	}

	/**
	 * Sets the new name of the room.
	 * @param name The room name, or `null` to do no modifications.
	 * @returns The current {@link ModifyRoomRequestBody} instance.
	 */
	public withName(name: string | null)
	{
		this.name = name;
		return this;
	}

	/**
	 * Sets the new description of the room.
	 * @param description The room description, or `null` to do no modifications.
	 * @returns The current {@link ModifyRoomRequestBody} instance.
	 */
	public withDescription(description: string | null)
	{
		this.description = description;
		return this;
	}

	/**
	 * Sets whether users with no room should be able to enter the room.
	 * @param isEntrance Indicates if the room should be an entrance, or `null` to do no modifications.
	 * @returns The current {@link ModifyRoomRequestBody} instance.
	 */
	public withIsEntrance(isEntrance: boolean | null)
	{
		this.isEntrance = isEntrance;
		return this;
	}

	/**
	 * Sets the id of the audio file to associate with the room.
	 * @param backgroundAudioId The file id, or `null` to do no modifications.
	 * @returns The current {@link ModifyRoomRequestBody} instance.
	 */
	public withBackgroundAudioId(backgroundAudioId: string | null)
	{
		this.backgroundAudioId = backgroundAudioId;
		return this;
	}

	/**
	 * Sets the ID collection of the destination rooms that will overwrite the current destination room values,
	 * or `null` if no modifications should be made.
	 * @param destinationIds The ID collection of the destination rooms.
	 * @returns The current {@link ModifyRoomRequestBody} instance.
	 * */
	public withDestinationIds(destinationIds: Iterable<string> | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(destinationIds, "iterable", "null");
		this.#_destinationIds = TypeHelper.isType(destinationIds, "iterable")
			? ArrayHelper.distinct(ArrayHelper.asArray(destinationIds))
			: null;
		this.#_destinationIdsView = null;
		return this;
	}

	public toJSON()
	{
		return {
			name: this.#_name,
			description: this.#_description,
			isEntrance: this.#_isEntrance,
			backgroundAudioId: this.#_backgroundAudioId,
			destinationIds: this.#_destinationIds,
		} as unknown;
	}
}

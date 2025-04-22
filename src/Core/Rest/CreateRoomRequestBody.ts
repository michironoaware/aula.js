import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";
import { RoomType } from "./Entities/RoomType";

/**
 * Represents the request body used to create a new room.
 * @sealed
 */
export class CreateRoomRequestBody
{
	#_type: RoomType | null = null;
	#_name: string | null = null;
	#_description: string | null = null;
	#_isEntrance: boolean | null = null;
	#_backgroundAudioId: string | null = null;

	/**
	 * Initializes a new instance of {@link CreateRoomRequestBody}.
	 */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(CreateRoomRequestBody, new.target);
	}

	/**
	 * Gets the type of the room to create.
	 */
	public get type()
	{
		return this.#_type;
	}

	/**
	 * Sets the type of the room to create.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param type The room type.
	 */
	public set type(type: RoomType | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(type, "number", "null");
		this.#_type = type;
	}

	/**
	 * Gets the name of the room to create.
	 */
	public get name()
	{
		return this.#_name;
	}

	/**
	 * Sets the name of the room to create.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param name The room name.
	 */
	public set name(name: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(name, "string", "null");
		this.#_name = name;
	}

	/**
	 * Gets the description of the room to create.
	 */
	public get description()
	{
		return this.#_description;
	}

	/**
	 * Sets the description of the room to create.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param description The room description.
	 */
	public set description(description: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(description, "string", "null");
		this.#_description = description;
	}

	/**
	 * Gets whether users with no room can enter the room.
	 */
	public get isEntrance()
	{
		return this.#_isEntrance;
	}

	/**
	 * Sets whether users with no room can enter the room.
	 * @param isEntrance Indicates if the room is an entrance, or `null` to let the server decide.
	 */
	public set isEntrance(isEntrance: boolean | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(isEntrance, "boolean", "null");
		this.#_isEntrance = isEntrance;
	}

	/**
	 * Gets the id of the audio file to associate with the room to create.
	 */
	public get backgroundAudioId()
	{
		return this.#_backgroundAudioId;
	}

	/**
	 * Sets the id of the audio file to associate with the room to create.
	 * @param backgroundAudioId The file id.
	 */
	public set backgroundAudioId(backgroundAudioId: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(backgroundAudioId, "string", "null");
		this.#_backgroundAudioId = backgroundAudioId;
	}

	/**
	 * Sets the type of the room to create.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param type The room type.
	 * @returns The current {@link CreateRoomRequestBody} instance.
	 */
	public withType(type: RoomType | null)
	{
		this.type = type;
		return this;
	}

	/**
	 * Sets the name of the room to create.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param name The room name.
	 * @returns The current {@link CreateRoomRequestBody} instance.
	 */
	public withName(name: string | null)
	{
		this.name = name;
		return this;
	}

	/**
	 * Sets the description of the room to create.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param description The room description.
	 * @returns The current {@link CreateRoomRequestBody} instance.
	 */
	public withDescription(description: string | null)
	{
		this.description = description;
		return this;
	}

	/**
	 * Sets whether users with no room can enter the room.
	 * @param isEntrance Indicates if the room is an entrance, or `null` to let the server decide.
	 * @returns The current {@link CreateRoomRequestBody} instance.
	 */
	public withIsEntrance(isEntrance: boolean | null)
	{
		this.isEntrance = isEntrance;
		return this;
	}

	/**
	 * Sets the id of the audio file to associate with the room to create.
	 * @param backgroundAudioId The file id.
	 * @returns The current {@link CreateRoomRequestBody} instance.
	 */
	public withBackgroundAudioId(backgroundAudioId: string | null)
	{
		this.backgroundAudioId = backgroundAudioId;
		return this;
	}

	public toJSON()
	{
		return {
			type: this.#_type,
			name: this.#_name,
			description: this.#_description,
			isEntrance: this.#_isEntrance,
			backgroundAudioId: this.#_backgroundAudioId
		};
	}
}

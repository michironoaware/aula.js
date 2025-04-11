import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { RoomType } from "./Entities/RoomType.js";

/**
 * Represents the request body used to create a new room.
 * @sealed
 */
export class CreateRoomRequestBody
{
	#_type: RoomType;
	#_name: string;
	#_description: string;
	#_isEntrance: boolean | null = null;
	#_backgroundAudioId: string | null = null;

	/**
	 * Initializes a new instance of {@link CreateRoomRequestBody}.
	 * @param requiredFields The required fields of the request body.
	 */
	public constructor(requiredFields: ICreateRoomRequestBodyRequiredFields)
	{
		SealedClassError.throwIfNotEqual(CreateRoomRequestBody, new.target);
		ThrowHelper.TypeError.throwIfNullable(requiredFields);
		ThrowHelper.TypeError.throwIfNotType(requiredFields.type, "number");
		ThrowHelper.TypeError.throwIfNotType(requiredFields.name, "string");
		ThrowHelper.TypeError.throwIfNotType(requiredFields.description, "string");

		this.#_type = requiredFields.type;
		this.#_name = requiredFields.name;
		this.#_description = requiredFields.description;
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
	 * @param type The room type.
	 */
	public set type(type: RoomType)
	{
		ThrowHelper.TypeError.throwIfNotType(type, "number");
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
	 * @param name The room name.
	 */
	public set name(name: string)
	{
		ThrowHelper.TypeError.throwIfNotType(name, "string");
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
	 * @param description The room description.
	 */
	public set description(description: string)
	{
		ThrowHelper.TypeError.throwIfNotType(description, "string");
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
	 * @param type The room type.
	 * @returns The current {@link CreateRoomRequestBody} instance.
	 */
	public withType(type: RoomType)
	{
		this.type = type;
		return this;
	}

	/**
	 * Sets the name of the room to create.
	 * @param name The room name.
	 * @returns The current {@link CreateRoomRequestBody} instance.
	 */
	public withName(name: string)
	{
		this.name = name;
		return this;
	}

	/**
	 * Sets the description of the room to create.
	 * @param description The room description.
	 * @returns The current {@link CreateRoomRequestBody} instance.
	 */
	public withDescription(description: string)
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

/**
 * The required fields of a {@link CreateRoomRequestBody}.
 * */
interface ICreateRoomRequestBodyRequiredFields
{
	/**
	 * The type of room to create.
	 * */
	type: RoomType;

	/**
	 * The name of the room to create.
	 * */
	name: string;

	/**
	 * The description of the room to create.
	 * */
	description: string;
}

import { SealedClassError } from "../../../Common/SealedClassError.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { Presence } from "../../Rest/Entities/Presence.js";
import { EventType } from "./EventType.js";

/**
 * Provides a strongly typed DTO class for the {@link EventType.UserPresenceUpdated} event data.
 * @sealed
 * @package
 * */
export class UserPresenceUpdatedEventData
{
	readonly #_userId: string;
	readonly #_presence: Presence;

	/**
	 * Initializes a new instance of {@link UserPresenceUpdatedEventData}.
	 * @param data An object that conforms to the {@link EventType.UserPresenceUpdated} event data JSON schema,
	 *             from where the data will be extracted.
	 * */
	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(UserPresenceUpdatedEventData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.userId, "string");
		ThrowHelper.TypeError.throwIfNotType(data.presence, "number");

		this.#_userId = data.userId;
		this.#_presence = data.presence;
	}

	/**
	 * Gets the id of the user whose presence was updated.
	 * */
	public get userId()
	{
		return this.#_userId;
	}

	/**
	 * Gets the new presence of the user.
	 * */
	public get presence()
	{
		return this.#_presence;
	}
}

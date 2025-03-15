import { UserTypingEventData } from "./Models/UserTypingEventData.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";

export class UserStoppedTypingEvent
{
	readonly #_data: UserTypingEventData;

	public constructor(data: UserTypingEventData)
	{
		SealedClassError.throwIfNotEqual(UserStoppedTypingEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, UserTypingEventData);

		this.#_data = data;
	}

	public get userId()
	{
		return this.#_data.userId;
	}

	public get roomId()
	{
		return this.#_data.roomId;
	}
}

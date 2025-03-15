import { UserTypingEventData } from "./Models/UserTypingEventData.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";

export class UserStartedTypingEvent
{
	readonly #_data: UserTypingEventData;

	public constructor(data: UserTypingEventData)
	{
		SealedClassError.throwIfNotEqual(UserStartedTypingEvent, new.target);
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

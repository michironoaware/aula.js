import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { UserCurrentRoomUpdatedEventData } from "./Models/UserCurrentRoomUpdatedEventData.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";

export class UserCurrentRoomUpdatedEvent
{
	readonly #_data: UserCurrentRoomUpdatedEventData;

	public constructor(data: UserCurrentRoomUpdatedEventData)
	{
		SealedClassError.throwIfNotEqual(UserCurrentRoomUpdatedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, UserCurrentRoomUpdatedEventData);

		this.#_data = data;
	}

	public get userId()
	{
		return this.#_data.userId;
	}

	public get previousRoomId()
	{
		return this.#_data.previousRoomId;
	}

	public get currentRoomId()
	{
		return this.#_data.currentRoomId;
	}
}

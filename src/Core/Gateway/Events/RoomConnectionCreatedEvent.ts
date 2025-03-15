import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { RoomConnectionEventData } from "./Models/RoomConnectionEventData.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";

export class RoomConnectionCreatedEvent
{
	readonly #_data: RoomConnectionEventData;

	public constructor(data: RoomConnectionEventData)
	{
		SealedClassError.throwIfNotEqual(RoomConnectionCreatedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, RoomConnectionEventData);

		this.#_data = data;
	}

	public get sourceRoomId()
	{
		return this.#_data.sourceRoomId;
	}

	public get targetRoomId()
	{
		return this.#_data.targetRoomId;
	}
}

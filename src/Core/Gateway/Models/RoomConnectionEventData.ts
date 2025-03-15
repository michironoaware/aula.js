import { SealedClassError } from "../../../Common/SealedClassError.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";

export class RoomConnectionEventData
{
	readonly #_sourceRoomId: string;
	readonly #_targetRoomId: string;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(RoomConnectionEventData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.sourceRoomId, "string");
		ThrowHelper.TypeError.throwIfNotType(data.targetRoomId, "string");

		this.#_sourceRoomId = data.sourceRoomId;
		this.#_targetRoomId = data.targetRoomId;
	}

	public get sourceRoomId()
	{
		return this.#_sourceRoomId;
	}

	public get targetRoomId()
	{
		return this.#_targetRoomId;
	}
}

import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../../Common/SealedClassError.js";

export class MessageUserLeaveData
{
	readonly #_userId: string;
	readonly #_roomId: string | null;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(MessageUserLeaveData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.userId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(data.roomId, "string", "null", "undefined");

		this.#_userId = data.userId;
		this.#_roomId = data.roomId ?? null;
	}

	public get userId()
	{
		return this.#_userId;
	}

	public get roomId()
	{
		return this.#_roomId;
	}
}

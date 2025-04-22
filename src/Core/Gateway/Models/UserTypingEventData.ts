import { SealedClassError } from "../../../Common/SealedClassError";
import { ThrowHelper } from "../../../Common/ThrowHelper";

/**
 * @sealed
 * */
export class UserTypingEventData
{
	readonly #_userId: string;
	readonly #_roomId: string;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(UserTypingEventData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.userId, "string");
		ThrowHelper.TypeError.throwIfNotType(data.roomId, "string");

		this.#_userId = data.userId;
		this.#_roomId = data.roomId;
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

import { SealedClassError } from "../../../Common/SealedClassError.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";

export class UserCurrentRoomUpdatedEventData
{
	readonly #_userId: string;
	readonly #_previousRoomId: string | null;
	readonly #_currentRoomId: string | null;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(UserCurrentRoomUpdatedEventData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.userId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(data.previousRoomId, "string", "null", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(data.currentRoomId, "string", "null", "undefined");

		this.#_userId = data.userId;
		this.#_previousRoomId = data.previousRoomId ?? null;
		this.#_currentRoomId = data.currentRoomId ?? null;
	}

	public get userId()
	{
		return this.#_userId;
	}

	public get previousRoomId()
	{
		return this.#_previousRoomId;
	}

	public get currentRoomId()
	{
		return this.#_currentRoomId;
	}
}

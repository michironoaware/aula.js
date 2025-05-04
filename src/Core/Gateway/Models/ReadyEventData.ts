import { SealedClassError } from "../../../Common/SealedClassError";
import { ThrowHelper } from "../../../Common/ThrowHelper";

/**
 * @sealed
 * */
export class ReadyEventData
{
	readonly #_sessionId: string;
	readonly #_userId: string;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(ReadyEventData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.sessionId, "string");
		ThrowHelper.TypeError.throwIfNotType(data.userId, "string");

		this.#_sessionId = data.sessionId;
		this.#_userId = data.userId;
	}

	public get sessionId()
	{
		return this.#_sessionId;
	}

	public get userId()
	{
		return this.#_userId;
	}
}

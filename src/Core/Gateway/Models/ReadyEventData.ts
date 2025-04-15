import { SealedClassError } from "../../../Common/SealedClassError.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";

/**
 * @sealed
 * */
export class ReadyEventData
{
	readonly #_sessionId: string;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(ReadyEventData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.sessionId, "string");

		this.#_sessionId = data.sessionId;
	}

	public get sessionId()
	{
		return this.#_sessionId;
	}
}

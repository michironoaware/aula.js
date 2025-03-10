import { SealedClassError } from "../../../../Common/SealedClassError.js";
import { ThrowHelper } from "../../../../Common/ThrowHelper.js";

export class HelloEventData
{
	readonly #sessionId: string;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(HelloEventData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.sessionId, "string");

		this.#sessionId = data.sessionId;
	}

	public get sessionId()
	{
		return this.#sessionId;
	}
}

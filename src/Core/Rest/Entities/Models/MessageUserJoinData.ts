import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../../Common/SealedClassError.js";

export class MessageUserJoinData
{
	readonly #_userId: string;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(MessageUserJoinData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.userId, "string");

		this.#_userId = data.userId;
	}

	public get userId()
	{
		return this.#_userId;
	}
}

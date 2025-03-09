import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../../Common/SealedClassError.js";

export class MessageUserJoinData
{
	readonly #userId: string;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(MessageUserJoinData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.userId, "string");

		this.#userId = data.userId;
	}

	public get userId()
	{
		return this.#userId;
	}
}

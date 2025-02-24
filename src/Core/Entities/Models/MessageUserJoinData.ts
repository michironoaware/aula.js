import {ThrowHelper} from "../../../Common/ThrowHelper.js";

export class MessageUserJoinData
{
	readonly #userId: string;

	public constructor(data: any)
	{
		ThrowHelper.TypeError.throwIfNotType(data, "object");
		ThrowHelper.TypeError.throwIfNotType(data.userId, "string");

		this.#userId = data.userId;
	}

	public get userId()
	{
		return this.#userId;
	}
}

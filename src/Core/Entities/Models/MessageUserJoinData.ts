import {ThrowHelper} from "../../../Common/ThrowHelper.js";

export class MessageUserJoinData
{
	readonly #userId: string;

	public constructor(data: any)
	{
		ThrowHelper.TypeError.throwIfNull(data);
		ThrowHelper.TypeError.throwIfNotType(data.userId, "string");

		this.#userId = data.userId;
	}

	get userId()
	{
		return this.#userId;
	}
}

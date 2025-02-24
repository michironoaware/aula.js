import {ThrowHelper} from "../../../Common/ThrowHelper.js";

export class MessageUserLeaveData
{
	readonly #userId: string;
	readonly #roomId: string | null;

	public constructor(data: any)
	{
		ThrowHelper.TypeError.throwIfNull(data);
		ThrowHelper.TypeError.throwIfNotType(data.userId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(data.roomId, "string", "null", "undefined");

		this.#userId = data.userId;
		this.#roomId = data.roomId;
	}

	public get userId()
	{
		return this.#userId;
	}

	public get roomId()
	{
		return this.#roomId;
	}
}

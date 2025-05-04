import { SealedClassError } from "../../../Common/SealedClassError";
import { ThrowHelper } from "../../../Common/ThrowHelper";
import { UserData } from "../../Rest/Entities/Models/UserData";

/**
 * @sealed
 * */
export class ReadyEventData
{
	readonly #_sessionId: string;
	readonly #_user: UserData;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(ReadyEventData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.sessionId, "string");

		this.#_sessionId = data.sessionId;
		this.#_user = new UserData(data.user);
	}

	public get sessionId()
	{
		return this.#_sessionId;
	}

	public get user()
	{
		return this.#_user;
	}
}

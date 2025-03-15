import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { SealedClassError } from "../../Common/SealedClassError.js";

export class GetCurrentUserBanStatusResponse
{
	readonly #_banned: boolean;

	constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(GetCurrentUserBanStatusResponse, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.banned, "boolean");

		this.#_banned = data.banned;
	}

	public get banned()
	{
		return this.#_banned;
	}
}

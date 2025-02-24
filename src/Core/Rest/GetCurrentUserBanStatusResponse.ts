import {ThrowHelper} from "../../Common/ThrowHelper.js";

export class GetCurrentUserBanStatusResponse
{
	readonly #banned: boolean;

	constructor(data: any)
	{
		ThrowHelper.TypeError.throwIfNotType(data, "object");
		ThrowHelper.TypeError.throwIfNotType(data.banned, "boolean");

		this.#banned = data.banned;
	}

	public get banned()
	{
		return this.#banned;
	}
}

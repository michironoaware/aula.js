import {ThrowHelper} from "../../Common/ThrowHelper.js";

export class ResetBotTokenResponse
{
	readonly #token: string;

	public constructor(data: any)
	{
		ThrowHelper.TypeError.throwIfNotType(data, "object");
		ThrowHelper.TypeError.throwIfNotType(data.token, "string");

		this.#token = data.token;
	}
}

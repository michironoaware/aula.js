import {ThrowHelper} from "../../Common/ThrowHelper.js";
import {SealedClassError} from "../../Common/SealedClassError.js";

export class ResetBotTokenResponse
{
	readonly #token: string;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(ResetBotTokenResponse, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.token, "string");

		this.#token = data.token;
	}
}

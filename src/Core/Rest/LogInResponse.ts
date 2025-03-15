import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { SealedClassError } from "../../Common/SealedClassError.js";

export class LogInResponse
{
	readonly #_token: string;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(LogInResponse, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.token, "string");

		this.#_token = data.token;
	}

	public get token()
	{
		return this.#_token;
	}
}

import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { SealedClassError } from "../../Common/SealedClassError.js";

/**
 * Represents the result of a successful bot token reset operation.
 * */
export class ResetBotTokenResponse
{
	readonly #_token: string;

	/**
	 * Initializes a new instance of {@link ResetBotTokenResponse}.
	 * @param data An object that conforms to the API v1 ResetBotTokenResponseBody JSON schema
	 *             from where the data will be extracted.
	 * @package
	 * */
	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(ResetBotTokenResponse, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.token, "string");

		this.#_token = data.token;
	}

	/**
	 * Gets the new authorization token of the bot.
	 * */
	public get token()
	{
		return this.#_token;
	}
}

import { ThrowHelper } from "../../Common/ThrowHelper";
import { SealedClassError } from "../../Common/SealedClassError";
import { RestClient } from "./RestClient";

/**
 * Represents the result of a successful bot token reset operation.
 * @sealed
 * */
export class ResetBotTokenResponse
{
	readonly #_token: string;
	readonly #_restClient: RestClient;

	/**
	 * Initializes a new instance of {@link ResetBotTokenResponse}.
	 * @param data An object that conforms to the API v1 ResetBotTokenResponseBody JSON schema
	 *             from where the data will be extracted.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: any, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(ResetBotTokenResponse, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.token, "string");
		//ThrowHelper.TypeError.throwIfNotType(restClient, RestClient); // Circular dependency problem

		this.#_token = data.token;
		this.#_restClient = restClient;
	}

	/**
	 * Gets the {@link RestClient} that initialized this instance.
	 * */
	public get restClient()
	{
		return this.#_restClient;
	}

	/**
	 * Gets the new authorization token of the bot.
	 * */
	public get token()
	{
		return this.#_token;
	}
}

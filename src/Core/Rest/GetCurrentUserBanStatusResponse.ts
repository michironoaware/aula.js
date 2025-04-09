import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { RestClient } from "./RestClient.js";

/**
 * Holds information about the current user's ban status.
 * */
export class GetCurrentUserBanStatusResponse
{
	readonly #_banned: boolean;
	readonly #_restClient: RestClient;

	/**
	 * Initializes a new instance of {@link GetCurrentUserBanStatusResponse}.
	 * @param data An object that conforms to the API v1 GetCurrentUserBanStatusResponseBody JSON schema
	 *             from where the data will be extracted.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	constructor(data: any, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(GetCurrentUserBanStatusResponse, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.banned, "boolean");
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

		this.#_banned = data.banned;
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
	 * Gets whether the current user is banned from the application.
	 * */
	public get banned()
	{
		return this.#_banned;
	}
}

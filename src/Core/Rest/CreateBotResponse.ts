import { User } from "./Entities/User.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { RestClient } from "./RestClient.js";
import { UserData } from "./Entities/Models/UserData.js";
import { SealedClassError } from "../../Common/SealedClassError.js";

/**
 * Represents the result of a successful bot creation operation.
 * */
export class CreateBotResponse
{
	readonly #_user: User;
	readonly #_token: string;
	readonly #_restClient: RestClient;

	/**
	 * Initializes a new instance of {@link CreateBotResponse}.
	 * @param data An object that conforms to the API v1 CreateBotResponseBody JSON schema
	 *             from where the data will be extracted.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: any, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(CreateBotResponse, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNullable(data.user);
		ThrowHelper.TypeError.throwIfNotType(data.token, "string");
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

		this.#_user = new User(new UserData(data.user), restClient);
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
	 * Gets the user of the bot created.
	 * */
	get user()
	{
		return this.#_user;
	}

	/**
	 * Gets the authorization token of the bot created.
	 * */
	get token()
	{
		return this.#_token;
	}
}

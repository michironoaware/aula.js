import { ThrowHelper } from "../../Common/ThrowHelper";
import { SealedClassError } from "../../Common/SealedClassError";
import { RestClient } from "./RestClient";

/**
 * Represents the result of a successful log-in operation.
 * @sealed
 * */
export class LogInResponse
{
	readonly #_token: string;
	readonly #_restClient: RestClient;

	/**
	 * Initializes a new instance of {@link LogInResponse}.
	 * @param data An object that conforms to the API v1 LogInResponseBody JSON schema
	 *             from where the data will be extracted.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: any, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(LogInResponse, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.token, "string");
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

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
	 * Gets the authorization token of the user.
	 * */
	public get token()
	{
		return this.#_token;
	}
}

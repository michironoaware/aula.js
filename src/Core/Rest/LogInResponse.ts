import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { RestClient } from "./RestClient.js";

export class LogInResponse
{
	readonly #_token: string;
	readonly #_restClient: RestClient;

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

	public get token()
	{
		return this.#_token;
	}
}

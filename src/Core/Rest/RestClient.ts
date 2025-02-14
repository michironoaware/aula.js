import {HttpClient} from "../../Common/Http/HttpClient.js";
import {FetchHttpClient} from "../../Common/Http/FetchHttpClient.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";

export class RestClient
{
	readonly #httpClient: HttpClient;
	#token: string | null = null;

	public constructor(
		baseUri: URL | null = null,
		httpClient: HttpClient = new FetchHttpClient())
	{
		ThrowHelper.TypeError.throwIfNotNullAndType(baseUri, URL);
		ThrowHelper.TypeError.throwIfNotType(httpClient, HttpClient);

		httpClient.baseUri = baseUri;
		this.#httpClient = httpClient;
	}

	public setToken(value: string)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "string");
		this.#httpClient.defaultRequestHeaders.delete("Authorization");
		this.#httpClient.defaultRequestHeaders.append("Authorization", `Bearer ${value}`);
		this.#token = value;
	}

	#throwIfNullToken()
	{
		ThrowHelper.TypeError.throwIfNotType(this.#token, "string");
	}
}

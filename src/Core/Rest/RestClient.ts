import {HttpClient} from "../../Common/Http/HttpClient.js";
import {FetchHttpClient} from "../../Common/Http/FetchHttpClient.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";
import {HttpResponseMessage} from "../../Common/Http/HttpResponseMessage.js";
import {HttpRequestError} from "../../Common/Http/HttpRequestError.js";
import {HttpStatusCode} from "../../Common/Http/HttpStatusCode.js";
import {AulaUnauthorizedError} from "./AulaUnauthorizedError.js";
import {AulaForbiddenError} from "./AulaForbiddenError.js";
import {AulaBadRequestError} from "./AulaBadRequestError.js";

export class RestClient
{
	readonly #httpClient: HttpClient;

	public constructor(
		baseUri: URL | null = null,
		httpClient: HttpClient = new FetchHttpClient())
	{
		ThrowHelper.TypeError.throwIfNotAnyType(baseUri, URL, "null");
		ThrowHelper.TypeError.throwIfNotType(httpClient, HttpClient);

		httpClient.baseUri = baseUri;
		this.#httpClient = httpClient;
	}

	static async #ensureSuccessStatusCode(response: HttpResponseMessage): Promise<void>
	{
		ThrowHelper.TypeError.throwIfNotType(response, HttpResponseMessage);

		try
		{
			response.ensureSuccessStatusCode();
		}
		catch (error)
		{
			if (!(error instanceof HttpRequestError))
			{
				return;
			}

			const content = await response.content.readAsString();
			switch (response.statusCode)
			{
				case HttpStatusCode.Unauthorized:
					throw new AulaUnauthorizedError(content);
				case HttpStatusCode.Forbidden:
					throw new AulaForbiddenError(content);
				case HttpStatusCode.BadRequest:
					throw new AulaBadRequestError(content);
				default:
					throw error;
			}
		}
	}

	public setToken(value: string)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "string");
		this.#httpClient.defaultRequestHeaders.delete("Authorization");
		this.#httpClient.defaultRequestHeaders.append("Authorization", `Bearer ${value}`);
	}
}

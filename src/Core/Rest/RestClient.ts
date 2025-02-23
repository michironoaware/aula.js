import {HttpClient} from "../../Common/Http/HttpClient.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";
import {HttpResponseMessage} from "../../Common/Http/HttpResponseMessage.js";
import {HttpRequestError} from "../../Common/Http/HttpRequestError.js";
import {HttpStatusCode} from "../../Common/Http/HttpStatusCode.js";
import {AulaUnauthorizedError} from "./AulaUnauthorizedError.js";
import {AulaForbiddenError} from "./AulaForbiddenError.js";
import {AulaBadRequestError} from "./AulaBadRequestError.js";
import {HttpMethod} from "../../Common/Http/HttpMethod.js";
import {HttpRequestMessage} from "../../Common/Http/HttpRequestMessage.js";
import {AulaRoute} from "../AulaRoute.js";
import {User} from "../Entities/User.js";
import {RestClientGetUsersOptions} from "./RestClientGetUsersOptions.js";
import {UserData} from "../Entities/Models/UserData.js";

export class RestClient
{
	readonly #httpClient: HttpClient;

	public constructor(httpClient: HttpClient = new HttpClient())
	{
		ThrowHelper.TypeError.throwIfNotType(httpClient, HttpClient);

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

	public setBaseUri(uri: URL)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(uri, URL);
		this.#httpClient.baseUri = uri;
		return this;
	}

	public setToken(value: string)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "string");
		this.#httpClient.defaultRequestHeaders.delete("Authorization");
		this.#httpClient.defaultRequestHeaders.append("Authorization", `Bearer ${value}`);
		return this;
	}

	public async getCurrentUser(): Promise<User>
	{
		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.CurrentUser());

		const response = await this.#httpClient.Send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		const userData = new UserData(JSON.parse(await response.content.readAsString()));
		return new User(this, userData);
	}

	public async getUsers(options: RestClientGetUsersOptions = RestClientGetUsersOptions.default): Promise<User[]>
	{
		ThrowHelper.TypeError.throwIfNotType(options, RestClientGetUsersOptions);

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.Users(
			{
				query:
					{
						type: options.type,
						count: options.count,
						after: options.after,
					}
			}
		));

		const response = await this.#httpClient.Send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
			.map((d: any) => new UserData(d))
			.map((d: UserData) => new User(this, d));
	}

	public async getUser(userId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.User({ route: { userId } }));

		const response = await this.#httpClient.Send(request);
		if (response.statusCode === HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		const userData = new UserData(JSON.parse(await response.content.readAsString()));
		return new User(this, userData);
	}
}


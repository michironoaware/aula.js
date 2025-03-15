import { User } from "./Entities/User.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { RestClient } from "./RestClient.js";
import { UserData } from "./Entities/Models/UserData.js";
import { SealedClassError } from "../../Common/SealedClassError.js";

export class CreateBotResponse
{
	readonly #_user: User;
	readonly #_token: string;

	public constructor(data: any, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(CreateBotResponse, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNullable(data.user);
		ThrowHelper.TypeError.throwIfNotType(data.token, "string");
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

		this.#_user = new User(new UserData(data.user), restClient);
		this.#_token = data.token;
	}

	get user()
	{
		return this.#_user;
	}

	get token()
	{
		return this.#_token;
	}
}

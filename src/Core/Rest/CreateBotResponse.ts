import {User} from "../Entities/User.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";
import {RestClient} from "./RestClient.js";
import {UserData} from "../Entities/Models/UserData.js";
import {SealedClassError} from "../../Common/SealedClassError.js";

export class CreateBotResponse
{
	readonly #user: User;
	readonly #token: string;

	public constructor(data: any, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(CreateBotResponse, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, "object");
		ThrowHelper.TypeError.throwIfNotType(data.user, "object");
		ThrowHelper.TypeError.throwIfNotType(data.token, "string");
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

		this.#user = new User(restClient, new UserData(data.user));
		this.#token = data.token;
	}

	get user()
	{
		return this.#user;
	}

	get token()
	{
		return this.#token;
	}
}

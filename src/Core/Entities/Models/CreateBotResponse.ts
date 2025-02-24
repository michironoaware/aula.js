import {User} from "../User.js";
import {ThrowHelper} from "../../../Common/ThrowHelper.js";
import {RestClient} from "../../Rest/RestClient.js";
import {UserData} from "./UserData.js";

export class CreateBotResponse
{
	readonly #user: User;
	readonly #token: string;

	public constructor(data: any, restClient: RestClient)
	{
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

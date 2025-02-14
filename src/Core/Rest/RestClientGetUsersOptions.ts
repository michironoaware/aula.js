import {UserType} from "../Entities/UserType.js";

export class RestClientGetUsersOptions
{
	static readonly #default = new RestClientGetUsersOptions();

	static get default()
	{
		return RestClientGetUsersOptions.#default;
	}

	public type?: UserType;
	public count?: number;
	public after?: string;
}

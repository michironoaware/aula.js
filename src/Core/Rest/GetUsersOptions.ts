import {UserType} from "../Entities/UserType.js";

export class GetUsersOptions
{
	static readonly #default = new GetUsersOptions();

	static get default()
	{
		return GetUsersOptions.#default;
	}

	public type?: UserType;
	public count?: number;
	public after?: string;
}

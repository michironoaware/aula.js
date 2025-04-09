import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { SealedClassError } from "../../Common/SealedClassError.js";

/**
 * Holds information about the current user's ban status.
 * */
export class GetCurrentUserBanStatusResponse
{
	readonly #_banned: boolean;

	/**
	 * Initializes a new instance of {@link GetCurrentUserBanStatusResponse}.
	 * @param data An object that conforms to the API v1 GetCurrentUserBanStatusResponseBody JSON schema
	 *             from where the data will be extracted.
	 * @package
	 * */
	constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(GetCurrentUserBanStatusResponse, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.banned, "boolean");

		this.#_banned = data.banned;
	}

	/**
	 * Gets whether the current user is banned from the application.
	 * */
	public get banned()
	{
		return this.#_banned;
	}
}

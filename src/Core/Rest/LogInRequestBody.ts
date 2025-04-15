import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { InvalidOperationError } from "../../Common/InvalidOperationError.js";

/**
 * Represents the request body of a user log-in request.
 * @sealed
 * */
export class LogInRequestBody
{
	#_userName: string | null = null;
	#_password: string | null = null;

	/**
	 * Initializes a new instance of {@link LogInRequestBody}.
	 * */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(LogInRequestBody, new.target);
	}

	/**
	 * Gets the username for the user to log-in.
	 * */
	public get userName()
	{
		return this.#_userName;
	}

	/**
	 * Sets the username for the user to log-in.
	 * @param userName the username string.
	 * */
	public set userName(userName: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(userName, "string", "null");
		this.#_userName = userName;
	}

	/**
	 * Gets the password to log in the user with.
	 * */
	public get password()
	{
		return this.#_password;
	}

	/**
	 * Sets the password to log in the user with.
	 * @param password The password string.
	 * */
	public set password(password: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(password, "string", "null");
		this.#_password = password;
	}

	/**
	 * Sets the username for the user to log-in.
	 * @param userName the username string.
	 * @returns The current {@link LogInRequestBody} instance.
	 * */
	public withUserName(userName: string | null)
	{
		this.userName = userName;
		return this;
	}

	/**
	 * Sets the password to log in the user with.
	 * @param password The password string.
	 * @returns The current {@link LogInRequestBody} instance.
	 * */
	public withPassword(password: string | null)
	{
		this.password = password;
		return this;
	}

	public toJSON()
	{
		InvalidOperationError.throwIf(this.#_userName === null, "A username must be provided first.");
		InvalidOperationError.throwIf(this.#_password === null, "A password must be provided first.");

		return {
			userName: this.#_userName,
			password: this.#_password,
		};
	}
}

import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";

/**
 * Represents the request body of a user register request.
 * @sealed
 * */
export class RegisterRequestBody
{
	#_userName: string | null = null;
	#_displayName: string | null = null;
	#_email: string | null = null;
	#_password: string | null = null;

	/**
	 * Initializes a new instance of {@link RegisterRequestBody}.
	 * */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(RegisterRequestBody, new.target);
	}

	/**
	 * Gets the username for the user to register.
	 * */
	public get userName()
	{
		return this.#_userName;
	}

	/**
	 * Sets the username for the user to register.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param userName the username string.
	 * */
	public set userName(userName: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(userName, "string", "null");
		this.#_userName = userName;
	}

	/**
	 * Gets the display name for the user to register.
	 * */
	public get displayName()
	{
		return this.#_displayName;
	}

	/**
	 * Sets the display name for the user to register.
	 * @param displayName the display name string.
	 * */
	public set displayName(displayName: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(displayName, "string", "null");
		this.#_displayName = displayName;
	}

	/**
	 * Gets the email of the user to register.
	 * */
	public get email()
	{
		return this.#_email;
	}

	/**
	 * Sets the email of the user to register.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param email The email of the user.
	 * */
	public set email(email: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(email, "string", "null");
		this.#_email = email;
	}

	/**
	 * Gets the password to register the user with.
	 * */
	public get password()
	{
		return this.#_password;
	}

	/**
	 * Sets the password to register the user with.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param password The password string.
	 * */
	public set password(password: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(password, "string", "null");
		this.#_password = password;
	}

	/**
	 * Sets the username for the user to register.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param userName the username string.
	 * @returns The current {@link RegisterRequestBody} instance.
	 * */
	public withUserName(userName: string | null)
	{
		this.userName = userName;
		return this;
	}

	/**
	 * Sets the display name for the user to register.
	 * @param displayName the display name string.
	 * @returns The current {@link RegisterRequestBody} instance.
	 * */
	public withDisplayName(displayName: string | null)
	{
		this.displayName = displayName;
		return this;
	}

	/**
	 * Sets the email of the user to register.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param email The email of the user.
	 * @returns The current {@link RegisterRequestBody} instance.
	 * */
	public withEmail(email: string | null)
	{
		this.email = email;
		return this;
	}

	/**
	 * Sets the password to register the user with.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param password The password string.
	 * @returns The current {@link RegisterRequestBody} instance.
	 * */
	public withPassword(password: string | null)
	{
		this.password = password;
		return this;
	}

	public toJSON()
	{
		return {
			userName: this.#_userName,
			displayName: this.#_displayName,
			email: this.#_email,
			password: this.#_password,
		};
	}
}

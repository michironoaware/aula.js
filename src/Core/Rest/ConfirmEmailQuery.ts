import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";

/**
 * Represents the query options used to confirm an email.
 * @sealed
 * */
export class ConfirmEmailQuery
{
	#_email: string | null = null;
	#_token: string | null = null;

	/**
	 * Initializes a new instance of {@link ConfirmEmailQuery}.
	 * */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(ConfirmEmailQuery, new.target);
	}

	/**
	 * Gets the email to confirm, encoded in Base64url.
	 * */
	public get email()
	{
		return this.#_email;
	}

	/**
	 * Sets the email to confirm.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param email The email address, encoded in Base64url.
	 * */
	public set email(email: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(email, "string", "null");
		this.#_email = email;
	}

	/**
	 * Gets the email confirmation token.
	 * */
	public get token()
	{
		return this.#_token;
	}

	/**
	 * Sets the email confirmation token.
	 * @param token The token string.
	 * */
	public set token(token: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(token, "string", "null");
		this.#_token = token;
	}

	/**
	 * Sets the email to confirm.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param email The email address, encoded in Base64url.
	 * @returns The current {@link ConfirmEmailQuery} instance.
	 * */
	public withEmail(email: string | null)
	{
		this.email = email;
		return this;
	}

	/**
	 * Sets the email confirmation token.
	 * @param token The token string.
	 * @returns The current {@link ConfirmEmailQuery} instance.
	 * */
	public withToken(token: string | null)
	{
		this.token = token;
		return this;
	}
}

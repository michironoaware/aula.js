import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";

/**
 * Represents the query options of an account recovery request.
 * @sealed
 * */
export class ForgotPasswordQuery
{
	#_email: string | null = null;
	#_token: string | null = null;

	/**
	 * Initializes a new instance of {@link ForgotPasswordQuery}.
	 * */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(ForgotPasswordQuery, new.target);
	}

	/**
	 * Gets the email of the account to recover.
	 * */
	public get email()
	{
		return this.#_email;
	}

	/**
	 * Sets the email of the account to recover.
	 * @param email The email address.
	 * */
	public set email(email: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(email, "string", "null");
		this.#_email = email;
	}

	/**
	 * Sets the email of the account to recover.
	 * @param email The email address.
	 * @returns The current {@link ForgotPasswordQuery} instance.
	 * */
	public withEmail(email: string | null)
	{
		this.email = email;
		return this;
	}
}

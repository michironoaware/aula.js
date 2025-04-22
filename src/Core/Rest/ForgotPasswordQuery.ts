import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";

/**
 * Represents the query options of an account recovery request.
 * @sealed
 * */
export class ForgotPasswordQuery
{
	#_email: string | null = null;

	/**
	 * Initializes a new instance of {@link ForgotPasswordQuery}.
	 * */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(ForgotPasswordQuery, new.target);
	}

	/**
	 * Gets the email of the account to recover, encoded in Base64url.
	 * */
	public get email()
	{
		return this.#_email;
	}

	/**
	 * Sets the email of the account to recover.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param email The email address, encoded in Base64url.
	 * */
	public set email(email: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(email, "string", "null");
		this.#_email = email;
	}

	/**
	 * Sets the email of the account to recover.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param email The email address, encoded in Base64url.
	 * @returns The current {@link ForgotPasswordQuery} instance.
	 * */
	public withEmail(email: string | null)
	{
		this.email = email;
		return this;
	}
}

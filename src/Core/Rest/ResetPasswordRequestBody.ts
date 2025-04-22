import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";

/**
 * Represents the request body of a password reset request.
 * @sealed
 * */
export class ResetPasswordRequestBody
{
	#_code: string | null = null;
	#_newPassword: string | null = null;

	/**
	 * Initializes a new instance of {@link ResetPasswordRequestBody}.
	 * */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(ResetPasswordRequestBody, new.target);
	}

	/**
	 * Gets the code required to reset the password.
	 * */
	public get code()
	{
		return this.#_code;
	}

	/**
	 * Sets the code required to reset the password.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param code The code string.
	 * */
	public set code(code: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(code, "string", "null");
		this.#_code = code;
	}

	/**
	 * Gets the new password for the user.
	 * */
	public get newPassword()
	{
		return this.#_newPassword;
	}

	/**
	 * Sets the new password for the user.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param newPassword The password string.
	 * */
	public set newPassword(newPassword: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(newPassword, "string", "null");
		this.#_newPassword = newPassword;
	}

	/**
	 * Sets the code required to reset the password.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param code The code string.
	 * @returns The current {@link ResetPasswordRequestBody} instance.
	 * */
	public withCode(code: string | null)
	{
		this.code = code;
		return this;
	}

	/**
	 * Sets the new password for the user.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param newPassword The password string.
	 * @returns The current {@link ResetPasswordRequestBody} instance.
	 * */
	public withNewPassword(newPassword: string | null)
	{
		this.newPassword = newPassword;
		return this;
	}

	public toJSON()
	{
		return { code: this.#_code, newPassword: this.#_newPassword };
	}
}

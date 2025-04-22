import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";

/**
 * Represents the request body used to modify the current user.
 * @sealed
 * */
export class ModifyCurrentUserRequestBody
{
	#_displayName: string | null = null;
	#_description: string | null = null;

	/**
	 * Initializes a new instance of {@link ModifyCurrentUserRequestBody}.
	 * */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(ModifyCurrentUserRequestBody, new.target);
	}

	/**
	 * Gets the new display name.
	 * */
	public get displayName()
	{
		return this.#_displayName;
	}

	/**
	 * Sets the new display name.
	 * @param displayName The new display name, or `null` to do no modifications.
	 * */
	public set displayName(displayName: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(displayName, "string", "null");
		this.#_displayName = displayName;
	}

	/**
	 * Gets the new description.
	 * */
	public get description()
	{
		return this.#_description;
	}

	/**
	 * Sets the new description.
	 * @param description The new description, or `null` to do no modifications.
	 * */
	public set description(description: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(description, "string", "null");
		this.#_description = description;
	}

	/**
	 * Sets the new display name.
	 * @param displayName The new display name, or `null` to do no modifications.
	 * @returns The current {@link GetUsersQuery} instance.
	 * */
	public withDisplayName(displayName: string | null)
	{
		this.displayName = displayName;
		return this;
	}

	/**
	 * Sets the new description.
	 * @param description The new description, or `null` to do no modifications.
	 * @returns The current {@link GetUsersQuery} instance.
	 * */
	public withDescription(description: string | null)
	{
		this.description = description;
		return this;
	}

	public toJSON()
	{
		return {
			displayName: this.#_displayName,
			description: this.#_description
		};
	}
}

import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";

/**
 * Represents the request body of a bot user creation request.
 * @sealed
 * */
export class CreateBotRequestBody
{
	#_displayName: string | null = null;

	/**
	 * Initializes a new instance of {@link CreateBotRequestBody}.
	 * */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(CreateBotRequestBody, new.target);
	}

	/**
	 * Gets the display name for the bot user to register.
	 * */
	public get displayName()
	{
		return this.#_displayName;
	}

	/**
	 * Sets the display name for the bot user to register.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param displayName the display name string.
	 * */
	public set displayName(displayName: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(displayName, "string", "null");
		this.#_displayName = displayName;
	}

	/**
	 * Sets the display name for the bot user to register.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param displayName the display name string.
	 * @returns The current {@link CreateBotRequestBody} instance.
	 * */
	public withDisplayName(displayName: string | null)
	{
		this.displayName = displayName;
		return this;
	}

	public toJSON()
	{
		return { displayName: this.#_displayName };
	}
}

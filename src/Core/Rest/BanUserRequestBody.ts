import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";

/**
 * Represents the request body of a ban request.
 * @sealed
 * */
export class BanUserRequestBody
{
	static #_default: BanUserRequestBody | null = null;

	#_reason: string | null = null;

	/**
	 * Initializes a new instance of {@link BanUserRequestBody}.
	 * */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(BanUserRequestBody, new.target);
	}

	public static get default()
	{
		return BanUserRequestBody.#_default ??= new BanUserRequestBody();
	}

	/**
	 * Gets the reason for the ban.
	 * */
	public get reason()
	{
		return this.#_reason;
	}

	/**
	 * Sets the reason for the ban.
	 * @param reason A text explaining why the ban was emitted, or `null` to leave it blank.
	 * */
	public set reason(reason: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(reason, "string", "null");
		this.#_reason = reason;
	}

	/**
	 * Sets the reason for the ban.
	 * @param reason A text explaining why the ban was emitted, or `null` to leave it blank.
	 * @returns The current {@link BanUserRequestBody} instance.
	 * */
	public withReason(reason: string | null)
	{
		this.reason = reason;
		return this;
	}

	public toJSON()
	{
		return { reason: this.#_reason } as unknown;
	}
}

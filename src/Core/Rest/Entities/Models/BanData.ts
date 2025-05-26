import { BanType } from "../BanType";
import { ThrowHelper } from "../../../../Common/ThrowHelper";
import { SealedClassError } from "../../../../Common/SealedClassError";
import { BanIssuerType } from "../BanIssuerType";

/**
 * Provides a strongly typed DTO class for the API v1 BanData JSON schema.
 * @sealed
 * @package
 * */
export class BanData
{
	readonly #_id: string;
	readonly #_type: BanType;
	readonly #_issuerType: BanIssuerType;
	readonly #_issuerId: string | null;
	readonly #_reason: string | null;
	readonly #_targetId: string | null;
	readonly #_isLifted: boolean;
	readonly #_emissionDate: string;

	/**
	 * Initializes a new instance of {@link BanData}.
	 * @param data An object that conforms to the API v1 BanData JSON schema
	 *             from where the data will be extracted.
	 * */
	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(BanData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.type, "number");
		ThrowHelper.TypeError.throwIfNotType(data.issuerType, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(data.issuerId, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotAnyType(data.reason, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotAnyType(data.targetId, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotType(data.isLifted, "boolean");
		ThrowHelper.TypeError.throwIfNotType(data.emissionDate, "string");

		switch (data.type)
		{
			case BanType.User:
				ThrowHelper.TypeError.throwIfNullable(data.targetid);
		}

		this.#_type = data.type;
		this.#_issuerType = data.issuerType;
		this.#_issuerId = data.issuerId ?? null;
		this.#_reason = data.reason ?? null;
		this.#_targetId = data.targetId ?? null;
		this.#_isLifted = data.isLifted;
		this.#_emissionDate = data.emissionDate;
	}

	/**
	 * Gets the id of the ban.
	 * */
	public get id()
	{
		return this.#_id;
	}

	/**
	 * Gets the type of the ban.
	 * */
	public get type()
	{
		return this.#_type;
	}

	/**
	 * Gets the type of the issuer of the ban.
	 * */
	public get issuerType()
	{
		return this.#_issuerType;
	}

	/**
	 * Gets the ID of the user who issued the ban.
	 * */
	public get issuerId()
	{
		return this.#_issuerId;
	}

	/**
	 * Gets the reason for the ban.
	 * */
	public get reason()
	{
		return this.#_reason;
	}

	/**
	 * Gets the ID of the banned user.
	 * */
	public get targetId()
	{
		return this.#_targetId;
	}

	/**
	 * Gets whether the ban is still in effect.
	 * */
	public get isLifted()
	{
		return this.#_isLifted;
	}

	/**
	 * Gets the emission date of the ban,
	 * expressed as a {@link https://en.wikipedia.org/wiki/ISO_8601 ISO 8601} string.
	 * */
	public get emissionDate()
	{
		return this.#_emissionDate;
	}
}

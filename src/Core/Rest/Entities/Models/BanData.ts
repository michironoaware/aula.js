import { BanType } from "../BanType.js";
import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../../Common/SealedClassError.js";

/**
 * Provides a strongly typed DTO class for the API v1 BanData JSON schema.
 * @sealed
 * @package
 * */
export class BanData
{
	readonly #_type: BanType;
	readonly #_executorId: string | null;
	readonly #_reason: string | null;
	readonly #_targetId: string | null;
	readonly #_creationDate: string;

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
		ThrowHelper.TypeError.throwIfNotAnyType(data.executorId, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotAnyType(data.reason, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotAnyType(data.targetId, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotType(data.creationDate, "string");

		switch (data.type)
		{
			case BanType.Id:
				ThrowHelper.TypeError.throwIfNullable(data.targetid);
		}

		this.#_type = data.type;
		this.#_executorId = data.executorId ?? null;
		this.#_reason = data.reason ?? null;
		this.#_targetId = data.targetId ?? null;
		this.#_creationDate = data.creationDate;
	}

	/**
	 * Gets the type of the ban.
	 * */
	public get type()
	{
		return this.#_type;
	}

	/**
	 * Gets the ID of the user who created the ban.
	 * */
	public get executorId()
	{
		return this.#_executorId;
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
	 * Gets the emission date of the ban,
	 * expressed as a {@link https://en.wikipedia.org/wiki/ISO_8601 ISO 8601} string.
	 * */
	public get creationDate()
	{
		return this.#_creationDate;
	}
}

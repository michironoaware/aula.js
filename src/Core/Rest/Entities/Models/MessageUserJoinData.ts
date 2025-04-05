import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../../Common/SealedClassError.js";

/**
 * Provides a strongly typed DTO class for the API v1 MessageUserJoinData JSON schema.
 * @package
 * */
export class MessageUserJoinData
{
	readonly #_userId: string;

	/**
	 * Initializes a new instance of {@link MessageUserJoinData}.
	 * @param data An object that conforms to the API v1 MessageUserJoinData JSON schema
	 *             from where the data will be extracted.
	 * */
	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(MessageUserJoinData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.userId, "string");

		this.#_userId = data.userId;
	}

	/**
	 * The id of the user who joined the room.
	 * */
	public get userId()
	{
		return this.#_userId;
	}
}

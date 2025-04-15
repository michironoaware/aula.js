import { MessageType } from "../MessageType.js";
import { MessageAuthorType } from "../MessageAuthorType.js";
import { MessageUserLeaveData } from "./MessageUserLeaveData.js";
import { MessageUserJoinData } from "./MessageUserJoinData.js";
import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { TypeHelper } from "../../../../Common/TypeHelper.js";
import { SealedClassError } from "../../../../Common/SealedClassError.js";
import { ValueOutOfRangeError } from "../../../../Common/ValueOutOfRangeError.js";

/**
 * Provides a strongly typed DTO class for the API v1 MessageData JSON schema.
 * @sealed
 * @package
 * */
export class MessageData
{
	readonly #_id: string;
	readonly #_type: MessageType;
	readonly #_flags: string;
	readonly #_authorType: MessageAuthorType;
	readonly #_authorId: string | null;
	readonly #_roomId: string;
	readonly #_text: string | null;
	readonly #_joinData: MessageUserJoinData | null;
	readonly #_leaveData: MessageUserLeaveData | null;
	readonly #_creationDate: string;

	/**
	 * Initializes a new instance of {@link MessageData}.
	 * @param data An object that conforms to the API v1 MessageData JSON schema
	 *             from where the data will be extracted.
	 * */
	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(MessageData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.id, "string");
		ThrowHelper.TypeError.throwIfNotType(data.type, "number");
		ThrowHelper.TypeError.throwIfNotType(data.flags, "string");
		ThrowHelper.TypeError.throwIfNotType(data.authorType, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(data.authorId, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotType(data.roomId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(data.text, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotType(data.creationDate, "string");

		switch (data.authorType)
		{
			case MessageAuthorType.User:
				ThrowHelper.TypeError.throwIfNullable(data.authorId);
				break;
		}

		switch (data.type)
		{
			case MessageType.Standard:
				ThrowHelper.TypeError.throwIfNullable(data.text);
				break;
			case MessageType.UserJoin:
				ThrowHelper.TypeError.throwIfNullable(data.joinData);
				ValueOutOfRangeError.throwIfNotEqual(data.authorType, MessageAuthorType.System);
				break;
			case MessageType.UserLeave:
				ThrowHelper.TypeError.throwIfNullable(data.leaveData);
				ValueOutOfRangeError.throwIfNotEqual(data.authorType, MessageAuthorType.System);
				break;
			default:
				break;
		}

		this.#_id = data.id;
		this.#_type = data.type;
		this.#_flags = data.flags;
		this.#_authorType = data.authorType;
		this.#_authorId = data.authorId ?? null;
		this.#_roomId = data.roomId;
		this.#_text = data.text ?? null;
		this.#_joinData = TypeHelper.isNullable(data.joinData) ? null : new MessageUserJoinData(data.joinData);
		this.#_leaveData = TypeHelper.isNullable(data.leaveData) ? null : new MessageUserLeaveData(data.leaveData);
		this.#_creationDate = data.creationDate;
	}

	/**
	 * Gets the id of the message.
	 * */
	public get id()
	{
		return this.#_id;
	}

	/**
	 * Gets the type of the message.
	 * */
	public get type()
	{
		return this.#_type;
	}

	/**
	 * Gets the flag bit fields of the message as a string.
	 * */
	public get flags()
	{
		return this.#_flags;
	}

	/**
	 * Gets the type of author of the message.
	 * */
	public get authorType()
	{
		return this.#_authorType;
	}

	/**
	 * Gets the id of the author of the message.
	 * */
	public get authorId()
	{
		return this.#_authorId;
	}

	/**
	 * Gets the id of the room where the message was sent.
	 * */
	public get roomId()
	{
		return this.#_roomId;
	}

	/**
	 * Gets the text content of the message.
	 * */
	public get text()
	{
		return this.#_text;
	}

	/**
	 * Gets additional data available only for {@link MessageType.UserJoin} messages.
	 * */
	public get joinData()
	{
		return this.#_joinData;
	}

	/**
	 * Gets additional data available only for {@link MessageType.UserLeave} messages.
	 * */
	public get leaveData()
	{
		return this.#_leaveData;
	}

	/**
	 * Gets the creation date of the message,
	 * expressed as a {@link https://en.wikipedia.org/wiki/ISO_8601 ISO 8601} string.
	 * */
	public get creationDate()
	{
		return this.#_creationDate;
	}
}

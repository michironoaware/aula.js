import { MessageType } from "../MessageType.js";
import { MessageFlags } from "../MessageFlags.js";
import { MessageAuthorType } from "../MessageAuthorType.js";
import { MessageUserLeaveData } from "./MessageUserLeaveData.js";
import { MessageUserJoinData } from "./MessageUserJoinData.js";
import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { TypeHelper } from "../../../../Common/TypeHelper.js";
import { SealedClassError } from "../../../../Common/SealedClassError.js";
import { ValueOutOfRangeError } from "../../../../Common/ValueOutOfRangeError.js";

export class MessageData
{
	readonly #_id: string;
	readonly #_type: MessageType;
	readonly #_flags: MessageFlags;
	readonly #_authorType: MessageAuthorType;
	readonly #_authorId: string | null;
	readonly #_roomId: string;
	readonly #_text: string | null;
	readonly #_joinData: MessageUserJoinData | null;
	readonly #_leaveData: MessageUserLeaveData | null;
	readonly #_creationDate: string;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(MessageData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.id, "string");
		ThrowHelper.TypeError.throwIfNotType(data.type, "number");
		ThrowHelper.TypeError.throwIfNotType(data.flags, "number");
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

	public get id()
	{
		return this.#_id;
	}

	public get type()
	{
		return this.#_type;
	}

	public get flags()
	{
		return this.#_flags;
	}

	public get authorType()
	{
		return this.#_authorType;
	}

	public get authorId()
	{
		return this.#_authorId;
	}

	public get roomId()
	{
		return this.#_roomId;
	}

	public get text()
	{
		return this.#_text;
	}

	public get joinData()
	{
		return this.#_joinData;
	}

	public get leaveData()
	{
		return this.#_leaveData;
	}

	public get creationDate()
	{
		return this.#_creationDate;
	}
}

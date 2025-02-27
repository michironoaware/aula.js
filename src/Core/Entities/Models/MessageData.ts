import {MessageType} from "../MessageType.js";
import {MessageFlags} from "../MessageFlags.js";
import {MessageAuthorType} from "../MessageAuthorType.js";
import {MessageUserLeaveData} from "./MessageUserLeaveData.js";
import {MessageUserJoinData} from "./MessageUserJoinData.js";
import {ThrowHelper} from "../../../Common/ThrowHelper.js";
import {Temporal} from "@js-temporal/polyfill";
import {TypeHelper} from "../../../Common/TypeHelper.js";
import {SealedClassError} from "../../../Common/SealedClassError.js";

export class MessageData
{
	readonly #id: string;
	readonly #type: MessageType;
	readonly #flags: MessageFlags;
	readonly #authorType: MessageAuthorType;
	readonly #authorId: string | null;
	readonly #roomId: string;
	readonly #content: string | null;
	readonly #joinData: MessageUserJoinData | null;
	readonly #leaveData: MessageUserLeaveData | null;
	readonly #creationTime: string;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(MessageData, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, "object");
		ThrowHelper.TypeError.throwIfNotType(data.id, "string");
		ThrowHelper.TypeError.throwIfNotType(data.type, "number");
		ThrowHelper.TypeError.throwIfNotType(data.flags, "number");
		ThrowHelper.TypeError.throwIfNotType(data.authorType, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(data.authorId, "string", "null", "undefined");
		ThrowHelper.TypeError.throwIfNotType(data.roomId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(data.content, "string", "null", "undefined");
		ThrowHelper.TypeError.throwIfNotType(data.creationTime, "string");

		this.#id = data.id;
		this.#type = data.type;
		this.#flags = data.flags;
		this.#authorType = data.authorType;
		this.#authorId = data.authorId ?? null;
		this.#roomId = data.roomId;
		this.#content = data.content ?? null;
		this.#joinData = TypeHelper.isType(data.joinData, "object") ? new MessageUserJoinData(data.joinData) : null;
		this.#leaveData = TypeHelper.isType(data.leaveData, "object") ? new MessageUserLeaveData(data.leaveData) : null;
		this.#creationTime = data.creationTime;
	}

	public get id()
	{
		return this.#id;
	}

	public get type()
	{
		return this.#type;
	}

	public get flags()
	{
		return this.#flags;
	}

	public get authorType()
	{
		return this.#authorType;
	}

	public get authorId()
	{
		return this.#authorId;
	}

	public get roomId()
	{
		return this.#roomId;
	}

	public get content()
	{
		return this.#content;
	}

	public get joinData()
	{
		return this.#joinData;
	}

	public get leaveData()
	{
		return this.#leaveData;
	}

	public get creationTime()
	{
		return this.#creationTime;
	}
}

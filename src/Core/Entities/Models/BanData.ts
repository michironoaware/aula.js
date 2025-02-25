import {BanType} from "./BanType.js";
import {ThrowHelper} from "../../../Common/ThrowHelper.js";

export class BanData
{
	readonly #type: BanType;
	readonly #executorId: string | null;
	readonly #reason: string | null;
	readonly #targetId: string | null;
	readonly #creationTime: string;

	public constructor(data: any)
	{
		ThrowHelper.TypeError.throwIfNotType(data, "object");
		ThrowHelper.TypeError.throwIfNotType(data.type, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(data.executorId, "string", "null", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(data.reason, "string", "null", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(data.targetId, "string", "null", "undefined");
		ThrowHelper.TypeError.throwIfNotType(data.creationTime, "string");

		this.#type = data.type;
		this.#executorId = data.executorId ?? null;
		this.#reason = data.reason ?? null;
		this.#targetId = data.targetId ?? null;
		this.#creationTime = data.creationTime;
	}

	public get type()
	{
		return this.#type;
	}

	public get executorId()
	{
		return this.#executorId;
	}

	public get reason()
	{
		return this.#reason;
	}

	public get targetId()
	{
		return this.#targetId;
	}

	public get creationTime()
	{
		return this.#creationTime;
	}
}

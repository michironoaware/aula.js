import { BanType } from "../BanType.js";
import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../../Common/SealedClassError.js";

export class BanData
{
	readonly #_type: BanType;
	readonly #_executorId: string | null;
	readonly #_reason: string | null;
	readonly #_targetId: string | null;
	readonly #_creationDate: string;

	public constructor(data: any)
	{
		SealedClassError.throwIfNotEqual(BanData, new.target);
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.type, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(data.executorId, "string", "null", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(data.reason, "string", "null", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(data.targetId, "string", "null", "undefined");
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

	public get type()
	{
		return this.#_type;
	}

	public get executorId()
	{
		return this.#_executorId;
	}

	public get reason()
	{
		return this.#_reason;
	}

	public get targetId()
	{
		return this.#_targetId;
	}

	public get creationDate()
	{
		return this.#_creationDate;
	}
}

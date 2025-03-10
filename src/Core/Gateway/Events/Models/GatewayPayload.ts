import { SealedClassError } from "../../../../Common/SealedClassError.js";
import { OperationType } from "../OperationType.js";
import { EventType } from "../EventType.js";
import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { TypeHelper } from "../../../../Common/TypeHelper.js";

export class GatewayPayload<TData>
{
	readonly #operation: OperationType;
	readonly #event: EventType;
	readonly #eventData: TData | null = null;

	public constructor(payloadData: any, eventDataTypeConstructor: new (arg1: any) => TData)
	{
		SealedClassError.throwIfNotEqual(GatewayPayload, new.target);
		ThrowHelper.TypeError.throwIfNullable(payloadData);
		ThrowHelper.TypeError.throwIfNotType(payloadData.operation, "number");
		ThrowHelper.TypeError.throwIfNotType(payloadData.event, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(eventDataTypeConstructor, "function");

		this.#operation = payloadData.operation;
		this.#event = payloadData.event;

		if (!TypeHelper.isNullable(payloadData.data))
		{
			this.#eventData = new eventDataTypeConstructor(payloadData.data);
		}
	}

	public get operation()
	{
		return this.#operation;
	}

	public get event()
	{
		return this.#event;
	}

	public get data()
	{
		return this.#eventData;
	}
}

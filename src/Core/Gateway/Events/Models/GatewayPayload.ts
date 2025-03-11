import { SealedClassError } from "../../../../Common/SealedClassError.js";
import { OperationType } from "../OperationType.js";
import { EventType } from "../EventType.js";
import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { HelloEventData } from "./HelloEventData.js";

export class GatewayPayload
{
	readonly #operation: OperationType;
	readonly #event: EventType | null;
	readonly #eventData: HelloEventData | null = null;

	public constructor(payloadData: any)
	{
		SealedClassError.throwIfNotEqual(GatewayPayload, new.target);
		ThrowHelper.TypeError.throwIfNullable(payloadData);
		ThrowHelper.TypeError.throwIfNotType(payloadData.operation, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(payloadData.event, "number", "null", "undefined");

		this.#operation = payloadData.operation;
		this.#event = payloadData.event ?? null;

		switch (this.#operation)
		{
			case OperationType.Hello:
			{
				ThrowHelper.TypeError.throwIfNullable(payloadData.data);
				this.#eventData = new HelloEventData(payloadData);
				break;
			}
			case OperationType.Dispatch:
			{
				ThrowHelper.TypeError.throwIfNullable(this.#event);
				ThrowHelper.TypeError.throwIfNullable(payloadData.Data);

				switch (this.#event)
				{
					// TODO:
				}

				break;
			}
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

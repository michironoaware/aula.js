import { SealedClassError } from "../../../Common/SealedClassError.js";
import { HelloEventData } from "./Models/HelloEventData.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";

export class HelloEvent
{
	readonly #data: HelloEventData;

	public constructor(data: HelloEventData)
	{
		SealedClassError.throwIfNotEqual(HelloEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, HelloEventData);

		this.#data = data;
	}

	public get sessionId()
	{
		return this.#data.sessionId;
	}
}

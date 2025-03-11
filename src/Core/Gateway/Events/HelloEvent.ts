import { SealedClassError } from "../../../Common/SealedClassError.js";
import { HelloOperationData } from "./Models/HelloOperationData.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";

export class HelloEvent
{
	readonly #data: HelloOperationData;

	public constructor(data: HelloOperationData)
	{
		SealedClassError.throwIfNotEqual(HelloEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, HelloOperationData);

		this.#data = data;
	}

	public get sessionId()
	{
		return this.#data.sessionId;
	}
}

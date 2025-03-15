import { SealedClassError } from "../../../Common/SealedClassError.js";
import { HelloOperationData } from "./Models/HelloOperationData.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { GatewayClient } from "../GatewayClient.js";

export class HelloEvent
{
	readonly #data: HelloOperationData;
	readonly #gatewayClient: GatewayClient;

	public constructor(data: HelloOperationData, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(HelloEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, HelloOperationData);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

		this.#data = data;
		this.#gatewayClient = gatewayClient;
	}

	public get sessionId()
	{
		return this.#data.sessionId;
	}

	public get gatewayClient()
	{
		return this.#gatewayClient;
	}
}

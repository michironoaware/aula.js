import { SealedClassError } from "../../Common/SealedClassError.js";
import { ReadyEventData } from "./Models/ReadyEventData.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { GatewayClient } from "./GatewayClient.js";

export class ReadyEvent
{
	readonly #_data: ReadyEventData;
	readonly #_gatewayClient: GatewayClient;

	public constructor(data: ReadyEventData, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(ReadyEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, ReadyEventData);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

		this.#_data = data;
		this.#_gatewayClient = gatewayClient;
	}

	public get sessionId()
	{
		return this.#_data.sessionId;
	}

	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

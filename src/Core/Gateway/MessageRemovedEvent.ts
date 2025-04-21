import { GatewayClient } from "./GatewayClient.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { MessageRemovedEventData } from "./Models/MessageRemovedEventData.js";

/**
 * @sealed
 * */
export class MessageRemovedEvent
{
	readonly #_data: MessageRemovedEventData;
	readonly #_gatewayClient: GatewayClient;

	public constructor(data: MessageRemovedEventData, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(MessageRemovedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, MessageRemovedEventData);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

		this.#_data = data;
		this.#_gatewayClient = gatewayClient;
	}

	public get messageId()
	{
		return this.#_data.id;
	}

	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

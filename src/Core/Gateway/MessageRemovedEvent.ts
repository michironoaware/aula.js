import { Message } from "../Rest/Entities/Message.js";
import { GatewayClient } from "./GatewayClient.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";

/**
 * @sealed
 * */
export class MessageRemovedEvent
{
	readonly #_message: Message;
	readonly #_gatewayClient: GatewayClient;

	public constructor(message: Message, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(MessageRemovedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(message, Message);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

		this.#_message = message;
		this.#_gatewayClient = gatewayClient;
	}

	public get message()
	{
		return this.#_message;
	}

	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

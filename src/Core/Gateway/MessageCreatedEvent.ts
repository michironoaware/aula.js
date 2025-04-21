import { Message } from "../Rest/Entities/Message.js";
import { GatewayClient } from "./GatewayClient.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";

/**
 * Emitted when a message has been sent.
 * @sealed
 * */
export class MessageCreatedEvent
{
	readonly #_message: Message;
	readonly #_gatewayClient: GatewayClient;

	/**
	 * @package
	 * */
	public constructor(message: Message, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(MessageCreatedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(message, Message);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

		this.#_message = message;
		this.#_gatewayClient = gatewayClient;
	}

	/**
	 * Gets the message associated to the event.
	 * */
	public get message()
	{
		return this.#_message;
	}

	/**
	 * Gets the {@link GatewayClient} that initialized this instance.
	 * */
	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

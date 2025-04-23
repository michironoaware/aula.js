import { Message } from "../Rest/Entities/Message";
import { GatewayClient } from "./GatewayClient";
import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";

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
		//ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient); // Circular dependency problem

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

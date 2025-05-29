import { GatewayClient } from "./GatewayClient";
import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";
import { MessageDeletedEventData } from "./Models/MessageDeletedEventData";

/**
 * Emitted when a message has been deleted.
 * @sealed
 * */
export class MessageDeletedEvent
{
	readonly #_data: MessageDeletedEventData;
	readonly #_gatewayClient: GatewayClient;

	/**
	 * @package
	 * */
	public constructor(data: MessageDeletedEventData, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(MessageDeletedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, MessageDeletedEventData);
		//ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient); // Circular dependency problem

		this.#_data = data;
		this.#_gatewayClient = gatewayClient;
	}

	/**
	 * Gets the id of the associated message.
	 * */
	public get messageId()
	{
		return this.#_data.id;
	}

	/**
	 * Gets the {@link GatewayClient} that initialized this instance.
	 * */
	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

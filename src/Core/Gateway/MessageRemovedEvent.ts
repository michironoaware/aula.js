import { GatewayClient } from "./GatewayClient";
import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";
import { MessageRemovedEventData } from "./Models/MessageRemovedEventData";

/**
 * Emitted when a message has been removed.
 * @sealed
 * */
export class MessageRemovedEvent
{
	readonly #_data: MessageRemovedEventData;
	readonly #_gatewayClient: GatewayClient;

	/**
	 * @package
	 * */
	public constructor(data: MessageRemovedEventData, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(MessageRemovedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, MessageRemovedEventData);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

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

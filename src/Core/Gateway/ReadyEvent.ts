import { SealedClassError } from "../../Common/SealedClassError.js";
import { ReadyEventData } from "./Models/ReadyEventData.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { GatewayClient } from "./GatewayClient.js";

/**
 * Emitted when the gateway connection has been established successfully.
 * @sealed
 * */
export class ReadyEvent
{
	readonly #_data: ReadyEventData;
	readonly #_gatewayClient: GatewayClient;

	/**
	 * @package
	 * */
	public constructor(data: ReadyEventData, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(ReadyEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, ReadyEventData);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

		this.#_data = data;
		this.#_gatewayClient = gatewayClient;
	}

	/**
	 * Gets the id of the session.
	 * */
	public get sessionId()
	{
		return this.#_data.sessionId;
	}

	/**
	 * Gets the {@link GatewayClient} that initialized this instance.
	 * */
	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

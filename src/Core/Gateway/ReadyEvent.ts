import { SealedClassError } from "../../Common/SealedClassError";
import { ReadyEventData } from "./Models/ReadyEventData";
import { ThrowHelper } from "../../Common/ThrowHelper";
import { GatewayClient } from "./GatewayClient";

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
		//ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient); // Circular dependency problem

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
	 * Gets the id of the current user.
	 * */
	public get userId()
	{
		return this.#_data.userId;
	}

	/**
	 * Gets the {@link GatewayClient} that initialized this instance.
	 * */
	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

import { ThrowHelper } from "../../Common/ThrowHelper";
import { RoomConnectionEventData } from "./Models/RoomConnectionEventData";
import { SealedClassError } from "../../Common/SealedClassError";
import { GatewayClient } from "./GatewayClient";

/**
 * Emitted when a connection between two rooms is removed.
 * @sealed
 * */
export class RoomConnectionRemovedEvent
{
	readonly #_data: RoomConnectionEventData;
	readonly #_gatewayClient: GatewayClient;

	/**
	 * @package
	 * */
	public constructor(data: RoomConnectionEventData, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(RoomConnectionRemovedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, RoomConnectionEventData);
		//ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient); // Circular dependency problem

		this.#_data = data;
		this.#_gatewayClient = gatewayClient;
	}

	/**
	 * Gets the id of the room from which users must come.
	 * */
	public get sourceRoomId()
	{
		return this.#_data.sourceRoomId;
	}

	/**
	 * Gets the id of the room that users can no longer go to.
	 * */
	public get targetRoomId()
	{
		return this.#_data.targetRoomId;
	}

	/**
	 * Gets the {@link GatewayClient} that initialized this instance.
	 * */
	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

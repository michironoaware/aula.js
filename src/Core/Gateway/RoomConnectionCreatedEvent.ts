import { ThrowHelper } from "../../Common/ThrowHelper";
import { RoomConnectionEventData } from "./Models/RoomConnectionEventData";
import { SealedClassError } from "../../Common/SealedClassError";
import { GatewayClient } from "./GatewayClient";

/**
 * Emitted when a connection between two rooms is created.
 * @sealed
 * */
export class RoomConnectionCreatedEvent
{
	readonly #_data: RoomConnectionEventData;
	readonly #_gatewayClient: GatewayClient;

	/**
	 * @package
	 * */
	public constructor(data: RoomConnectionEventData, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(RoomConnectionCreatedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, RoomConnectionEventData);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

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
	 * Gets the id of the room users can go to.
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

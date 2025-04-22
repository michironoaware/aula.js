import { Room } from "../Rest/Entities/Room.js";
import { GatewayClient } from "./GatewayClient.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";

/**
 * Emitted when a room is created.
 * @sealed
 * */
export class RoomCreatedEvent
{
	readonly #_room: Room;
	readonly #_gatewayClient: GatewayClient;

	/**
	 * @package
	 * */
	public constructor(room: Room, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(RoomCreatedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(room, Room);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

		this.#_room = room;
		this.#_gatewayClient = gatewayClient;
	}

	/**
	 * Gets the id of the room created.
	 * */
	public get room()
	{
		return this.#_room;
	}

	/**
	 * Gets the {@link GatewayClient} that initialized this instance.
	 * */
	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

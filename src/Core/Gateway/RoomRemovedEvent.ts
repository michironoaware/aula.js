import { Room } from "../Rest/Entities/Room";
import { GatewayClient } from "./GatewayClient";
import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";

/**
 * Emitted when a room is removed.
 * @sealed
 * */
export class RoomRemovedEvent
{
	readonly #_room: Room;
	readonly #_gatewayClient: GatewayClient;

	/**
	 * @package
	 * */
	public constructor(room: Room, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(RoomRemovedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(room, Room);
		//ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient); // Circular dependency problem

		this.#_room = room;
		this.#_gatewayClient = gatewayClient;
	}

	/**
	 * Gets the id of the room removed.
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

import { Room } from "../../Rest/Entities/Room.js";
import { GatewayClient } from "../GatewayClient.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";

export class RoomRemovedEvent
{
	readonly #_room: Room;
	readonly #_gatewayClient: GatewayClient;

	public constructor(room: Room, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(RoomRemovedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(room, Room);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

		this.#_room = room;
		this.#_gatewayClient = gatewayClient;
	}

	public get room()
	{
		return this.#_room;
	}

	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

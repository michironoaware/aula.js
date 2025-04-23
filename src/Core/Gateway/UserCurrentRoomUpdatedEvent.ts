import { ThrowHelper } from "../../Common/ThrowHelper";
import { UserCurrentRoomUpdatedEventData } from "./Models/UserCurrentRoomUpdatedEventData";
import { SealedClassError } from "../../Common/SealedClassError";
import { GatewayClient } from "./GatewayClient";

/**
 * Emitted when a user moves from room.
 * @sealed
 * */
export class UserCurrentRoomUpdatedEvent
{
	readonly #_data: UserCurrentRoomUpdatedEventData;
	readonly #_gatewayClient: GatewayClient;

	/**
	 * @package
	 * */
	public constructor(data: UserCurrentRoomUpdatedEventData, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(UserCurrentRoomUpdatedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, UserCurrentRoomUpdatedEventData);
		//ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient); // Circular dependency problem

		this.#_data = data;
		this.#_gatewayClient = gatewayClient;
	}

	/**
	 * Gets the id of the user associated to the event.
	 * */
	public get userId()
	{
		return this.#_data.userId;
	}

	/**
	 * Gets the id of the room where the user comes from,
	 * or `null` if the user did not come from any room.
	 * */
	public get previousRoomId()
	{
		return this.#_data.previousRoomId;
	}

	/**
	 * Gets the id of the room where the user moved to,
	 * or `null` if the user was not relocated.
	 * */
	public get currentRoomId()
	{
		return this.#_data.currentRoomId;
	}

	/**
	 * Gets the {@link GatewayClient} that initialized this instance.
	 * */
	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

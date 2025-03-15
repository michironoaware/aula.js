import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { UserCurrentRoomUpdatedEventData } from "./Models/UserCurrentRoomUpdatedEventData.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { GatewayClient } from "./GatewayClient.js";

export class UserCurrentRoomUpdatedEvent
{
	readonly #_data: UserCurrentRoomUpdatedEventData;
	readonly #_gatewayClient: GatewayClient;

	public constructor(data: UserCurrentRoomUpdatedEventData, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(UserCurrentRoomUpdatedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, UserCurrentRoomUpdatedEventData);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

		this.#_data = data;
		this.#_gatewayClient = gatewayClient;
	}

	public get userId()
	{
		return this.#_data.userId;
	}

	public get previousRoomId()
	{
		return this.#_data.previousRoomId;
	}

	public get currentRoomId()
	{
		return this.#_data.currentRoomId;
	}

	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

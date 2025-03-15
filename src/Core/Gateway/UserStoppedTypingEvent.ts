import { UserTypingEventData } from "./Models/UserTypingEventData.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { GatewayClient } from "./GatewayClient.js";

export class UserStoppedTypingEvent
{
	readonly #_data: UserTypingEventData;
	readonly #_gatewayClient: GatewayClient;

	public constructor(data: UserTypingEventData, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(UserStoppedTypingEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, UserTypingEventData);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

		this.#_data = data;
		this.#_gatewayClient = gatewayClient;
	}

	public get userId()
	{
		return this.#_data.userId;
	}

	public get roomId()
	{
		return this.#_data.roomId;
	}

	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

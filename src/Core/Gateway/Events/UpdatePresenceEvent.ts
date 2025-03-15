import { PresenceOptions } from "./PresenceOptions.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { GatewayClient } from "../GatewayClient.js";

export class UpdatePresenceEvent
{
	readonly #_presence: PresenceOptions;
	readonly #_gatewayClient: GatewayClient;

	public constructor(presence: PresenceOptions, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(UpdatePresenceEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(presence, PresenceOptions);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

		this.#_presence = presence;
		this.#_gatewayClient = gatewayClient;
	}

	public get presence()
	{
		return this.#_presence;
	}

	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

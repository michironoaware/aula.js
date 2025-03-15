import { Ban } from "../../Rest/Entities/Ban.js";
import { GatewayClient } from "../GatewayClient.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";

export class BanRemovedEvent
{
	readonly #_ban: Ban;
	readonly #_gatewayClient: GatewayClient;

	public constructor(ban: Ban, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(BanRemovedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(ban, Ban);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

		this.#_ban = ban;
		this.#_gatewayClient = gatewayClient;
	}

	public get ban()
	{
		return this.#_ban;
	}

	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

﻿import { Ban } from "../Rest/Entities/Ban";
import { GatewayClient } from "./GatewayClient";
import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";

/**
 * Emitted when a ban has been issued.
 * @sealed
 * */
export class BanIssuedEvent
{
	readonly #_ban: Ban;
	readonly #_gatewayClient: GatewayClient;

	/**
	 * @package
	 * */
	public constructor(ban: Ban, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(BanIssuedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(ban, Ban);
		//ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient); // Circular dependency problem

		this.#_ban = ban;
		this.#_gatewayClient = gatewayClient;
	}

	/**
	 * Gets the ban associated to the event.
	 * */
	public get ban()
	{
		return this.#_ban;
	}

	/**
	 * Gets the {@link GatewayClient} that initialized this instance.
	 * */
	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

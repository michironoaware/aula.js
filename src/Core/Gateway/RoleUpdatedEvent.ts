import { Role } from "../Rest/Entities/Role";
import { GatewayClient } from "./GatewayClient";
import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";

/**
 * Emitted when a role is updated.
 * @sealed
 * */
export class RoleUpdatedEvent
{
	readonly #_role: Role;
	readonly #_gatewayClient: GatewayClient;

	/**
	 * @package
	 * */
	public constructor(role: Role, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(RoleUpdatedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(role, Role);
		//ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient); // Circular dependency problem

		this.#_role = role;
		this.#_gatewayClient = gatewayClient;
	}

	/**
	 * Gets the id of the role updated.
	 * */
	public get role()
	{
		return this.#_role;
	}

	/**
	 * Gets the {@link GatewayClient} that initialized this instance.
	 * */
	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

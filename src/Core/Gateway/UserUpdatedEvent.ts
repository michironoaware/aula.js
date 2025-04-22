import { User } from "../Rest/Entities/User.js";
import { GatewayClient } from "./GatewayClient.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";

/**
 * Emitted when a user is updated.
 *
 * For presence updates, listen to {@link UserPresenceUpdatedEvent}.
 *
 * For room updates, listen to {@link UserCurrentRoomUpdatedEvent}.
 * @sealed
 * */
export class UserUpdatedEvent
{
	readonly #_user: User;
	readonly #_gatewayClient: GatewayClient;

	/**
	 * @package
	 * */
	public constructor(user: User, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(UserUpdatedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(user, User);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

		this.#_user = user;
		this.#_gatewayClient = gatewayClient;
	}

	/**
	 * Gets the user updated.
	 * */
	public get user()
	{
		return this.#_user;
	}

	/**
	 * Gets the {@link GatewayClient} that initialized this instance.
	 * */
	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

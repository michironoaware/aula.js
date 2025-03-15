import { User } from "../../Rest/Entities/User.js";
import { GatewayClient } from "../GatewayClient.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";

export class UserUpdatedEvent
{
	readonly #_user: User;
	readonly #_gatewayClient: GatewayClient;

	public constructor(user: User, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(UserUpdatedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(user, User);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

		this.#_user = user;
		this.#_gatewayClient = gatewayClient;
	}

	public get user()
	{
		return this.#_user;
	}

	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

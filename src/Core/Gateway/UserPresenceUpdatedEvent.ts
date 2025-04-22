import { UserPresenceUpdatedEventData } from "./Models/UserPresenceUpdatedEventData.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { CancellationToken } from "../../Common/Threading/CancellationToken.js";
import { GatewayClient } from "./GatewayClient.js";

/**
 * Represents a {@link EventType.UserPresenceUpdated} event.
 * @sealed
 * */
export class UserPresenceUpdatedEvent
{
	readonly #_data: UserPresenceUpdatedEventData;
	readonly #_gatewayClient: GatewayClient;

	/**
	 * Initializes a new instance of {@link UserPresenceUpdatedEvent}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: UserPresenceUpdatedEventData, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(UserPresenceUpdatedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, UserPresenceUpdatedEventData);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

		this.#_data = data;
		this.#_gatewayClient = gatewayClient;
	}

	/**
	 * Gets the {@link GatewayClient} that initialized this instance.
	 * */
	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}

	/**
	 * Gets the id of the user whose presence was updated.
	 * */
	public get userId()
	{
		return this.#_data.userId;
	}

	/**
	 * Gets the new presence of the user.
	 * */
	public get presence()
	{
		return this.#_data.presence;
	}

	/**
	 * Gets the user whose presence was updated.
	 * @param cancellationToken A cancellation token to listen to.
	 * @returns A promise that resolves to a {@link User}.
	 * */
	public async getUser(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return this.gatewayClient.rest.getUser(this.userId, cancellationToken);
	}
}

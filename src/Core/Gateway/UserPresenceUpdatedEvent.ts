import { UserPresenceUpdatedEventData } from "./Models/UserPresenceUpdatedEventData.js";
import { RestClient } from "../Rest/RestClient.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { CancellationToken } from "../../Common/Threading/CancellationToken.js";
import { EventType } from "./Models/EventType.js";

/**
 * Represents a {@link EventType.UserPresenceUpdated} event.
 * @sealed
 * */
export class UserPresenceUpdatedEvent
{
	readonly #_data: UserPresenceUpdatedEventData;
	readonly #_restClient: RestClient;

	/**
	 * Initializes a new instance of {@link UserPresenceUpdatedEvent}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: UserPresenceUpdatedEventData, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(UserPresenceUpdatedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, UserPresenceUpdatedEventData);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

		this.#_data = data;
		this.#_restClient = restClient;
	}

	/**
	 * Gets the {@link RestClient} that initialized this instance.
	 * */
	public get restClient()
	{
		return this.#_restClient;
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
		return this.restClient.getUser(this.userId, cancellationToken);
	}
}

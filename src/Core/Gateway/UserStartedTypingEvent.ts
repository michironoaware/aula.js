import { UserTypingEventData } from "./Models/UserTypingEventData.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { GatewayClient } from "./GatewayClient.js";

/**
 * Emitted when a user started typing a message.
 * @sealed
 * */
export class UserStartedTypingEvent
{
	readonly #_data: UserTypingEventData;
	readonly #_gatewayClient: GatewayClient;

	/**
	 * @package
	 * */
	public constructor(data: UserTypingEventData, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(UserStartedTypingEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, UserTypingEventData);
		ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient);

		this.#_data = data;
		this.#_gatewayClient = gatewayClient;
	}

	/**
	 * Gets the id of the user that started typing.
	 * */
	public get userId()
	{
		return this.#_data.userId;
	}

	/**
	 * Gets the id of the room where the user is typing.
	 * */
	public get roomId()
	{
		return this.#_data.roomId;
	}

	/**
	 * Gets the {@link GatewayClient} that initialized this instance.
	 * */
	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

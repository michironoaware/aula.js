import { Message } from "./Message";
import { MessageData } from "./Models/MessageData";
import { MessageUserJoin } from "./MessageUserJoin";
import { RestClient } from "../RestClient";
import { SealedClassError } from "../../../Common/SealedClassError";
import { MessageType } from "./MessageType";
import { InvalidOperationError } from "../../../Common/InvalidOperationError";

/**
 * Represents a message announcing that a user has joined a room.
 * @sealed
 * */
export class UserJoinMessage extends Message
{
	readonly #_data: MessageData;
	#_userJoin: MessageUserJoin | null = null;

	/**
	 * @package
	 * */
	public constructor(data: MessageData, restClient: RestClient)
	{
		super(data, restClient);
		SealedClassError.throwIfNotEqual(UserJoinMessage, new.target);

		if (data.type !== MessageType.UserJoin)
		{
			throw new InvalidOperationError(`Unexpected message type.`);
		}

		this.#_data = data;
	}

	/**
	 * Gets the additional data included in this {@link MessageType.UserJoin} message.
	 * */
	public get userJoin()
	{
		return this.#_userJoin ??= new MessageUserJoin(this.#_data.joinData!, this.restClient);
	}
}

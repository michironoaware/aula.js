import { Message } from "./Message.js";
import { MessageData } from "./Models/MessageData.js";
import { MessageUserLeave } from "./MessageUserLeave.js";
import { RestClient } from "../RestClient.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { MessageType } from "./MessageType.js";
import { InvalidOperationError } from "../../../Common/InvalidOperationError.js";

/**
 * Represents a message announcing that a user has left a room.
 * @sealed
 * */
export class UserLeaveMessage extends Message
{
	readonly #_data: MessageData;
	#_userLeave: MessageUserLeave | null = null;

	/**
	 * @package
	 * */
	public constructor(data: MessageData, restClient: RestClient)
	{
		super(data, restClient);
		SealedClassError.throwIfNotEqual(UserLeaveMessage, new.target);

		if (data.type !== MessageType.UserLeave)
		{
			throw new InvalidOperationError(`Unexpected message type.`);
		}

		this.#_data = data;
	}

	/**
	 * Gets the additional data included in this {@link MessageType.UserLeave} message.
	 * */
	public get userLeave()
	{
		return this.#_userLeave ??= new MessageUserLeave(this.#_data.leaveData!, this.restClient);
	}
}

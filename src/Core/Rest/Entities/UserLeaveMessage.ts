import { Message } from "./Message";
import { MessageData } from "./Models/MessageData";
import { MessageUserLeave } from "./MessageUserLeave";
import { RestClient } from "../RestClient";
import { SealedClassError } from "../../../Common/SealedClassError";
import { MessageType } from "./MessageType";
import { InvalidOperationError } from "../../../Common/InvalidOperationError";

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

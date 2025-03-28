import { Message } from "./Message.js";
import { MessageData } from "./Models/MessageData.js";
import { MessageUserLeave } from "./MessageUserLeave.js";
import { RestClient } from "../RestClient.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { MessageType } from "./MessageType.js";
import { InvalidOperationError } from "../../../Common/InvalidOperationError.js";

export class UserLeaveMessage extends Message
{
	readonly #_data: MessageData;
	#_userLeave: MessageUserLeave | null = null;

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

	public get userLeave()
	{
		return this.#_userLeave ??= this.#_data.leaveData ? new MessageUserLeave(this.#_data.leaveData, this.restClient) : null;
	}

	public async getLatest()
	{
		return await super.getLatest() as UserLeaveMessage | null;
	}
}

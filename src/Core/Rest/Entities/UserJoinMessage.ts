import { Message } from "./Message.js";
import { MessageData } from "./Models/MessageData.js";
import { MessageUserJoin } from "./MessageUserJoin.js";
import { RestClient } from "../RestClient.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { MessageType } from "./MessageType.js";
import { InvalidOperationError } from "../../../Common/InvalidOperationError.js";

export class UserJoinMessage extends Message
{
	readonly #_data: MessageData;
	#_userJoin: MessageUserJoin | null = null;

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

	public get userJoin()
	{
		return this.#_userJoin ??= new MessageUserJoin(this.#_data.joinData!, this.restClient);
	}

	public async getLatest()
	{
		return await super.getLatest() as UserJoinMessage | null;
	}
}

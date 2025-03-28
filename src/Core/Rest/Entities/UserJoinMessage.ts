import { Message } from "./Message.js";
import { MessageData } from "./Models/MessageData.js";
import { MessageUserJoin } from "./MessageUserJoin.js";
import { RestClient } from "../RestClient.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";

export class UserJoinMessage extends Message
{
	readonly #_data: MessageData;
	#_userJoin: MessageUserJoin | null = null;

	public constructor(data: MessageData, restClient: RestClient)
	{
		super(data, restClient);
		SealedClassError.throwIfNotEqual(UserJoinMessage, new.target);
		this.#_data = data;
	}

	public get userJoin()
	{
		return this.#_userJoin ??= this.#_data.joinData ? new MessageUserJoin(this.#_data.joinData, this.restClient) : null;
	}

	public async getLatest()
	{
		return await super.getLatest() as UserJoinMessage | null;
	}
}

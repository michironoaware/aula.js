import { Message } from "./Message.js";
import { MessageData } from "./Models/MessageData.js";
import { RestClient } from "../RestClient.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";

export class StandardMessage extends Message
{
	readonly #_data: MessageData;

	public constructor(data: MessageData, restClient: RestClient)
	{
		super(data, restClient);
		SealedClassError.throwIfNotEqual(StandardMessage, new.target);
		this.#_data = data;
	}

	public get content()
	{
		return this.#_data.content!;
	}
}

import { Message } from "./Message.js";
import { MessageData } from "./Models/MessageData.js";
import { RestClient } from "../RestClient.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { MessageType } from "./MessageType.js";
import { InvalidOperationError } from "../../../Common/InvalidOperationError.js";

export class StandardMessage extends Message
{
	readonly #_data: MessageData;

	public constructor(data: MessageData, restClient: RestClient)
	{
		super(data, restClient);
		SealedClassError.throwIfNotEqual(StandardMessage, new.target);

		if (data.type !== MessageType.Standard)
		{
			throw new InvalidOperationError(`Unexpected message type.`);
		}

		this.#_data = data;
	}

	public get content()
	{
		return this.#_data.content!;
	}

	public async getLatest()
	{
		return await super.getLatest() as StandardMessage | null;
	}
}

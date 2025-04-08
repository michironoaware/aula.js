import { Message } from "./Message.js";
import { MessageData } from "./Models/MessageData.js";
import { RestClient } from "../RestClient.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { MessageType } from "./MessageType.js";
import { InvalidOperationError } from "../../../Common/InvalidOperationError.js";

/**
 * Represents a text message within Aula.
 * */
export class StandardMessage extends Message
{
	readonly #_data: MessageData;

	/**
	 * Initializes a new instance of {@link StandardMessage}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
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

	/**
	 * Gets the text content of the message.
	 * */
	public get text()
	{
		return this.#_data.text!;
	}

	/**
	 * Gets the latest version of the message.
	 * @returns A promise that resolves to a {@link StandardMessage}, or `null` if the message no longer exists.
	 * */
	public async getLatest()
	{
		return await super.getLatest() as StandardMessage | null;
	}
}

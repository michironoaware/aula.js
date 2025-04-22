import { Message } from "./Message";
import { MessageData } from "./Models/MessageData";
import { RestClient } from "../RestClient";
import { SealedClassError } from "../../../Common/SealedClassError";
import { MessageType } from "./MessageType";
import { InvalidOperationError } from "../../../Common/InvalidOperationError";

/**
 * Represents a text message within Aula.
 * @sealed
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
}

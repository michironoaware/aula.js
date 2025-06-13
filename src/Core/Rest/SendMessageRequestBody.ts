import { SealedClassError } from "../../Common/SealedClassError";
import { MessageType } from "./Entities/MessageType";
import { MessageFlags } from "./Entities/MessageFlags";
import { ThrowHelper } from "../../Common/ThrowHelper";

/**
 * The request body used for sending a message.
 * @sealed
 */
export class SendMessageRequestBody
{
	#_type: typeof MessageType.Default | null = null;
	#_flags: MessageFlags | null = null;
	#_text: string | null = null;

	/**
	 * Initializes a new instance of {@link SendMessageRequestBody}.
	 * */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(SendMessageRequestBody, new.target);
	}

	/**
	 * Gets the type of the message being sent.
	 */
	public get type()
	{
		return this.#_type;
	}

	/**
	 * Sets the type of the message being sent.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param type The message type.
	 */
	public set type(type: typeof MessageType.Default | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(type, "number", "null");
		this.#_type = type;
	}

	/**
	 * Gets the flags of the message being sent.
	 */
	public get flags()
	{
		return this.#_flags;
	}

	/**
	 * Sets the flags of the message being sent.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param flags The message bit flags.
	 */
	public set flags(flags: MessageFlags | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(flags, "bigint", "null");
		this.#_flags = flags;
	}

	/**
	 * Gets the text content of the message being sent.
	 */
	public get text()
	{
		return this.#_text;
	}

	/**
	 * Sets the text content of the message being sent.
	 * @param text The text string.
	 */
	public set text(text: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(text, "string", "null");
		this.#_text = text;
	}

	/**
	 * Sets the type of the message being sent.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param type The message type.
	 * @returns The current {@link SendMessageRequestBody}.
	 */
	public withType(type: typeof MessageType.Default | null)
	{
		this.type = type;
		return this;
	}

	/**
	 * Sets the flags of the message being sent.
	 * Must be set to a non-null value by the time this body is passed to a rest operation.
	 * @param flags The message bit flags.
	 * @returns The current {@link SendMessageRequestBody}.
	 */
	public withFlags(flags: MessageFlags | null)
	{
		this.flags = flags;
		return this;
	}

	/**
	 * Sets the text content of the message being sent.
	 * @param text The text string.
	 * @returns The current {@link SendMessageRequestBody}.
	 */
	public withText(text: string | null)
	{
		this.text = text;
		return this;
	}

	public toJSON()
	{
		return { type: this.#_type, flags: this.#_flags, text: this.#_text } as unknown;
	}
}

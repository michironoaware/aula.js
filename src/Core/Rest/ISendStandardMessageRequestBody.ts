import { ISendUnknownMessageRequestBody } from "./ISendUnknownMessageRequestBody.js";
import { MessageType } from "./Entities/MessageType.js";

/**
 * The payload structure for sending a standard text message.
 */
export interface ISendStandardMessageRequestBody extends ISendUnknownMessageRequestBody
{
	/**
	 * The type of the message. Must be {@link MessageType.Standard}.
	 */
	readonly type: typeof MessageType.Standard;

	/**
	 * The message content. This field is required for standard messages.
	 */
	readonly content: string;
}

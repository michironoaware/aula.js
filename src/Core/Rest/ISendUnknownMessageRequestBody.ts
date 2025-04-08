import { MessageType } from "./Entities/MessageType.js";
import { MessageFlags } from "./Entities/MessageFlags.js";

/**
 * The payload structure for sending a message of an unknown type.
 */
export interface ISendUnknownMessageRequestBody
{
	/**
	 * The type of the message being sent.
	 */
	readonly type: Exclude<MessageType, typeof MessageType.UserLeave | typeof MessageType.UserJoin>;

	/**
	 * The flags of the message being sent.
	 */
	readonly flags?: MessageFlags;

	/**
	 * The text content of the message being sent.
	 */
	readonly content?: string;
}

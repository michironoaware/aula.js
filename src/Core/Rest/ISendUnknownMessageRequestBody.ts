import { MessageType } from "./Entities/MessageType.js";
import { MessageFlags } from "./Entities/MessageFlags.js";

export interface ISendUnknownMessageRequestBody
{
	readonly type: Exclude<MessageType, MessageType.UserLeave | MessageType.UserJoin>;
	readonly flags?: MessageFlags;
	readonly content?: string;
}

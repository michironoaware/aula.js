import {MessageType} from "../Entities/MessageType.js";
import {MessageFlags} from "../Entities/MessageFlags.js";

export interface ISendUnknownMessageRequestBody
{
	readonly type: Extract<MessageType, MessageType.Standard>;
	readonly flags?: MessageFlags;
	readonly content?: string;
}

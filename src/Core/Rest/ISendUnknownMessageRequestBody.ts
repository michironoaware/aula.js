import {MessageType} from "../Entities/MessageType.js";
import {MessageFlags} from "../Entities/MessageFlags.js";

export interface ISendUnknownMessageRequestBody
{
	readonly type: MessageType;
	readonly flags?: MessageFlags;
	readonly content?: string;
}

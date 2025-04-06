import { ISendUnknownMessageRequestBody } from "./ISendUnknownMessageRequestBody.js";
import { MessageType } from "./Entities/MessageType.js";

export interface ISendStandardMessageRequestBody extends ISendUnknownMessageRequestBody
{
	readonly type: typeof MessageType.Standard;
	readonly content: string;
}

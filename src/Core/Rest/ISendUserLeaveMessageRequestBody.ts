import {ISendUnknownMessageRequestBody} from "./ISendUnknownMessageRequestBody.js";
import {MessageType} from "../Entities/MessageType.js";

export interface ISendUserLeaveMessageRequestBody extends ISendUnknownMessageRequestBody
{
	readonly type: MessageType.UserLeave;
	readonly content: undefined;
}

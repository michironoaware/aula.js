import {ISendUnknownMessageRequestBody} from "./ISendUnknownMessageRequestBody.js";
import {MessageType} from "../Entities/MessageType.js";

export interface ISendUserJoinMessageRequestBody extends ISendUnknownMessageRequestBody
{
	readonly type: MessageType.UserJoin;
	readonly content: undefined;
}

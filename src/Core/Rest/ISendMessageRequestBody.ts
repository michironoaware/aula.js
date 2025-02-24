import {ISendStandardMessageRequestBody} from "./ISendStandardMessageRequestBody.js";
import {ISendUserJoinMessageRequestBody} from "./ISendUserJoinMessageRequestBody.js";
import {ISendUserLeaveMessageRequestBody} from "./ISendUserLeaveMessageRequestBody.js";

export type ISendMessageRequestBody = ISendStandardMessageRequestBody | ISendUserJoinMessageRequestBody | ISendUserLeaveMessageRequestBody;


import { ISendStandardMessageRequestBody } from "./ISendStandardMessageRequestBody.js";

/**
 * Represents the request body for sending any kind of message.
 * @privateRemarks Currently, only standard messages are supported, but this type may be
 *                 updated in the future to include other message types.
 */
export type ISendMessageRequestBody = ISendStandardMessageRequestBody;

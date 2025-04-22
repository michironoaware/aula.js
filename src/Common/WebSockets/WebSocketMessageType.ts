/**
 * Indicates the message type.
 * */
export const WebSocketMessageType =
	{
		/**
		 * The message is clear text.
		 * */
		Text: 0,

		/**
		 * The message is in binary format.
		 */
		Binary: 1,

		/**
		 * A {@link WebSocket.receive} has completed because a close message was received.
		 * */
		Close: 2,
	} as const;

Object.freeze(WebSocketMessageType);

export type WebSocketMessageType = typeof WebSocketMessageType[keyof typeof WebSocketMessageType] | number;

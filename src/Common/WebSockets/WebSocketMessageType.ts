/**
 * Indicates the message type.
 * */
export enum WebSocketMessageType
{
	/**
	 * The message is clear text.
	 * */
	Text,

	/**
	 * The message is in binary format.
	 */
	Binary,

	/**
	 * A {@link WebSocket.receive} has completed because a close message was received.
	 * */
	Close
}

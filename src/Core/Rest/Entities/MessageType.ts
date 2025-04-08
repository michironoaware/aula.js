/**
 * Enumerates the message types.
 * */
export const MessageType =
	{
		/**
		 * A text message.
		 * */
		Standard: 0,

		/**
		 * Sent when a user joins the room.
		 * */
		UserJoin: 1,

		/**
		 * Sent when a user leaves the room.
		 * */
		UserLeave: 2,
	} as const;

Object.freeze(MessageType);

export type MessageType = typeof MessageType[keyof typeof MessageType] | number;

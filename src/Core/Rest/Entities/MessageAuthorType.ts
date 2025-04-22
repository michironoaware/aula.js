/**
 * Enumerates the types of author for a message.
 * */
export const MessageAuthorType =
	{
		/**
		 * The message was sent by a user.
		 * */
		User: 0,

		/**
		 * The message was sent by the system.
		 * */
		System: 1,
	} as const;

Object.freeze(MessageAuthorType);

export type MessageAuthorType = typeof MessageAuthorType[keyof typeof MessageAuthorType] | number; 

/**
 * Enumerates the flags that can be applied to a message.
 */
export const MessageFlags =
	{
		/**
		 * Indicates that the author of the message should be hidden in the UI.
		 */
		HideAuthor: 1n,

		/**
		 * Indicates that the message content describes an action performed by the author.
		 * When this flag is set, the message should be displayed with the author's display name
		 * preceding the action text, to clearly attribute the action to the author.
		 */
		Action: 2n,
	} as const;

Object.freeze(MessageFlags);

export type MessageFlags = typeof MessageFlags[keyof typeof MessageFlags] | bigint;

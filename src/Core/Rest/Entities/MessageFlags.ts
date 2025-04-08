/**
 * Enumerates the flags that can be applied to a message.
 */
export const MessageFlags =
{
	/**
	 * Indicates that the author of the message should be hidden in the UI.
	 */
	HideAuthor: 1n,
} as const;

Object.freeze(MessageFlags);

export type MessageFlags = typeof MessageFlags[keyof typeof MessageFlags] | bigint;

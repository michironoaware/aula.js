export const MessageFlags =
{
	HideAuthor: 1n,
} as const;

Object.freeze(MessageFlags);

export type MessageFlags = typeof MessageFlags[keyof typeof MessageFlags] | bigint;

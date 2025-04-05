export const MessageFlags =
{
	HideAuthor: 1n << 0n,
}

Object.freeze(MessageFlags);

export type MessageFlags = typeof MessageFlags[keyof typeof MessageFlags];

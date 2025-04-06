export const MessageAuthorType =
{
	User: 0,
	System: 1,
} as const;

Object.freeze(MessageAuthorType);

export type MessageAuthorType = typeof MessageAuthorType[keyof typeof MessageAuthorType] | number; 

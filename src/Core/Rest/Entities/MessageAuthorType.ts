export const MessageAuthorType: {
	User: 0,
	System: 1,
} =
{
	User: 0,
	System: 1,
}

Object.freeze(MessageAuthorType);

export type MessageAuthorType = typeof MessageAuthorType[keyof typeof MessageAuthorType]; 

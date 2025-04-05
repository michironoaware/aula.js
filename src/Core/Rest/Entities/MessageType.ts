export const MessageType: {
	Standard: 0,
	UserJoin: 1,
	UserLeave: 2,
} = {
	Standard: 0,
	UserJoin: 1,
	UserLeave: 2,
};

Object.freeze(MessageType);

export type MessageType = typeof MessageType[keyof typeof MessageType];

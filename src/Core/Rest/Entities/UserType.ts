export const UserType =
{
	Standard: 0,
	Bot: 1,
} as const;

Object.freeze(UserType);

export type UserType = typeof UserType[keyof typeof UserType];

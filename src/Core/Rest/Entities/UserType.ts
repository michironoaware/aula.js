/**
 * Enumerates the different types of users.
 * */
export const UserType =
{
	/**
	 * A regular user.
	 * */
	Standard: 0,

	/**
	 * An automated user, such as a bot or integration.
	 * */
	Bot: 1,
} as const;

Object.freeze(UserType);

export type UserType = typeof UserType[keyof typeof UserType] | number;

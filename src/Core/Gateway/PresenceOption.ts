export const PresenceOption =
{
	Invisible: 0,
	Online: 1,
} as const;

Object.freeze(PresenceOption);

export type PresenceOption = typeof PresenceOption[keyof typeof PresenceOption] | number;

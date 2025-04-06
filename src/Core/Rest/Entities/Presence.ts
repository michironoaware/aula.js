export const Presence =
{
	Offline: 0,
	Online: 1,
} as const;

Object.freeze(Presence);

export type Presence = typeof Presence[keyof typeof Presence];

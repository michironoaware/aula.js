export const Presence: {
	Offline: 0,
	Online: 1,
} =
{
	Offline: 0,
	Online: 1,
}

Object.freeze(Presence);

export type Presence = typeof Presence[keyof typeof Presence];

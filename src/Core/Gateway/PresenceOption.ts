export const PresenceOption: {
	Invisible: 0,
	Online: 1,
} =
{
	Invisible: 0,
	Online: 1,
}

Object.freeze(PresenceOption);

export type PresenceOption = typeof PresenceOption[keyof typeof PresenceOption];

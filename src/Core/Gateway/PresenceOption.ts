/**
 * Enumerates the presence values that can be passed when establishing a gateway connection.
 * */
export const PresenceOption =
	{
		/**
		 * The user will be shown as {@link Presence.Offline}.
		 * */
		Invisible: 0,

		/**
		 * The user will be shown as {@link Presence.Online}.
		 * */
		Online: 1,
	} as const;

Object.freeze(PresenceOption);

export type PresenceOption = typeof PresenceOption[keyof typeof PresenceOption] | number;

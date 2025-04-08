/**
 * Enumerates the presence statuses a user can have.
 * */
export const Presence =
{
	/**
	 * The user is offline and not currently active.
	 * This may also represent an invisible or disconnected state.
	 */
	Offline: 0,

	/**
	 * The user is online and actively connected.
	 * Indicates availability and presence in the application.
	 */
	Online: 1,
} as const;

Object.freeze(Presence);

export type Presence = typeof Presence[keyof typeof Presence] | number;

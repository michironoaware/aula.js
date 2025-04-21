/**
 * Enumerates the names of the events that can be dispatched in a gateway session.
 */
export const EventType =
{
	// Receive
	/**
	 * The gateway connection is ready
	 * */
	Ready: "Ready",

	/**
	 * A new room has been created.
	 */
	RoomCreated: "RoomCreated",

	/**
	 * A room has been updated.
	 */
	RoomUpdated: "RoomUpdated",

	/**
	 * A room has been removed.
	 */
	RoomRemoved: "RoomRemoved",

	/**
	 * A connection between two rooms has been created.
	 */
	RoomConnectionCreated: "RoomConnectionCreated",

	/**
	 * A room connection has been removed.
	 */
	RoomConnectionRemoved: "RoomConnectionRemoved",

	/**
	 * A user has been updated.
	 */
	UserUpdated: "UserUpdated",

	/**
	 * A user has moved from room.
	 */
	UserCurrentRoomUpdated: "UserCurrentRoomUpdated",

	/**
	 * A user presence has been updated.
	 * */
	UserPresenceUpdated: "UserPresenceUpdated",

	/**
	 * A new message has been sent.
	 */
	MessageCreated: "MessageCreated",

	/**
	 * A message has been deleted.
	 */
	MessageRemoved: "MessageRemoved",

	/**
	 * A user has started typing in a room.
	 */
	UserStartedTyping: "UserStartedTyping",

	/**
	 * A user stopped typing in a room.
	 */
	UserStoppedTyping: "UserStoppedTyping",

	/**
	 * A ban has been emitted.
	 */
	BanCreated: "BanCreated",

	/**
	 * A ban has been lifted.
	 */
	BanRemoved: "BanRemoved",

	// Send
	/**
	 * Updates the current presence status for the current user.
	 */
	UpdatePresence: "UpdatePresence",
} as const;

Object.freeze(EventType);

export type EventType = typeof EventType[keyof typeof EventType] | string;

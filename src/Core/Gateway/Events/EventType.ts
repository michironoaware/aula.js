/**
 * The name of the events that can be dispatched in a gateway session.
 */
export enum EventType
{
	// Send

	/**
	 * A new room has been created.
	 */
	RoomCreated,

	/**
	 * A room has been updated.
	 */
	RoomUpdated,

	/**
	 * A room has been removed.
	 */
	RoomRemoved,

	/**
	 * A connection between two rooms has been created.
	 */
	RoomConnectionCreated,

	/**
	 * A room connection has been removed.
	 */
	RoomConnectionRemoved,

	/**
	 * A user has been updated.
	 */
	UserUpdated,

	/**
	 * A user has moved from room.
	 */
	UserCurrentRoomUpdated,

	/**
	 * A new message has been sent.
	 */
	MessageCreated,

	/**
	 * A message has been deleted.
	 */
	MessageRemoved,

	/**
	 * A user has started typing in a room.
	 */
	UserStartedTyping,

	/**
	 * A user stopped typing in a room.
	 */
	UserStoppedTyping,

	/**
	 * A user has been banned.
	 */
	BanCreated,

	/**
	 * A user has been unbanned.
	 */
	BanRemoved,

	// Receive

	/**
	 * Updates the current presence status for the current user.
	 */
	UpdatePresence,
}

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
		 * A room has been deleted.
		 */
		RoomDeleted: "RoomDeleted",

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
		MessageDeleted: "MessageDeleted",

		/**
		 * A user has started typing in a room.
		 */
		UserStartedTyping: "UserStartedTyping",

		/**
		 * A ban has been emitted.
		 */
		BanIssued: "BanIssued",

		/**
		 * A ban has been lifted.
		 */
		BanLifted: "BanLifted",

		/**
		 * A role has been created.
		 * */
		RoleCreated: "RoleCreated",

		/**
		 * A role has been updated.
		 * */
		RoleUpdated: "RoleUpdated",

		/**
		 * A role has been deleted.
		 * */
		RoleDeleted: "RoleDeleted",

		/**
		 * A file has been created.
		 * */
		FileCreated: "FileCreated",

		// Send
		/**
		 * Updates the current presence status for the current user.
		 */
		UpdatePresence: "UpdatePresence",
	} as const;

Object.freeze(EventType);

export type EventType = typeof EventType[keyof typeof EventType] | string;

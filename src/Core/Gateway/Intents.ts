import { EventType } from "./Models/EventType.js";

/**
 * Enumerates the intent values that can be passed when establishing a gateway connection.
 * Intents define which events are delivered to the client.
 * */
export const Intents =
	{
		/**
		 * - {@link EventType.UserUpdated}
		 * - {@link EventType.UserCurrentRoomUpdated}
		 * - {@link EventType.UserPresenceUpdated}
		 * */
		Users: 1n,

		/**
		 * - {@link EventType.RoomCreated}
		 * - {@link EventType.RoomRemoved}
		 * - {@link EventType.RoomUpdated}
		 * - {@link EventType.RoomConnectionCreated}
		 * - {@link EventType.RoomConnectionRemoved}
		 * */
		Rooms: 2n,

		/**
		 * - {@link EventType.MessageCreated}
		 * - {@link EventType.MessageRemoved}
		 * - {@link EventType.UserStartedTyping}
		 * - {@link EventType.UserStoppedTyping}
		 * */
		Messages: 4n,

		/**
		 * - {@link EventType.BanCreated}
		 * - {@link EventType.BanRemoved}
		 * */
		Moderation: 8n,
	} as const;

Object.freeze(Intents);

export type Intents = typeof Intents[keyof typeof Intents] | bigint;

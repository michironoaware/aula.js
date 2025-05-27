import { EventType } from "./Models/EventType";

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
		 * */
		Rooms: 2n,

		/**
		 * - {@link EventType.MessageCreated}
		 * - {@link EventType.MessageRemoved}
		 * - {@link EventType.UserStartedTyping}
		 * */
		Messages: 4n,

		/**
		 * - {@link EventType.BanLifted}
		 * - {@link EventType.BanIssued}
		 * */
		Moderation: 8n,
	} as const;

Object.freeze(Intents);

export type Intents = typeof Intents[keyof typeof Intents] | bigint;

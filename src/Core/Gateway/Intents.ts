import { EventType } from "./Models/EventType";

/**
 * Enumerates the intent values that can be passed when establishing a gateway connection.
 * Intents define which events are delivered to the client.
 * */
export const Intents =
	{
		/**
		 * - {@link EventType.MessageCreated}
		 * - {@link EventType.MessageDeleted}
		 * - {@link EventType.UserStartedTyping}
		 * */
		Messages: 1n,

		/**
		 * - {@link EventType.BanLifted}
		 * - {@link EventType.BanIssued}
		 * */
		Moderation: 2n,
	} as const;

Object.freeze(Intents);

export type Intents = typeof Intents[keyof typeof Intents] | bigint;

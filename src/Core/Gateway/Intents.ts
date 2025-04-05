export const Intents: {
	Users: 1n,
	Rooms: 2n,
	Messages: 4n,
	Moderation: 8n,
} =
{
	Users: 1n,
	Rooms: 2n,
	Messages: 4n,
	Moderation: 8n,
}

Object.freeze(Intents);

export type Intents = typeof Intents[keyof typeof Intents] | bigint;

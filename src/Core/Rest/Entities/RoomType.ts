export const RoomType =
{
	Text: 0
} as const;

Object.freeze(RoomType);

export type RoomType = typeof RoomType[keyof typeof RoomType];

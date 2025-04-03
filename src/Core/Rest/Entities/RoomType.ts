export const RoomType =
{
	Text: 0
}

Object.freeze(RoomType);

export type RoomType = typeof RoomType[keyof typeof RoomType];

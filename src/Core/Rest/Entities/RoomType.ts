export const RoomType =
{
	Standard: 0
}

Object.freeze(RoomType);

export type RoomType = typeof RoomType[keyof typeof RoomType];

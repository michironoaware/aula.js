/**
 * Enumerates the types of rooms.
 * */
export const RoomType =
{
	/**
	 * A text room.
	 * */
	Text: 0
} as const;

Object.freeze(RoomType);

export type RoomType = typeof RoomType[keyof typeof RoomType] | number;

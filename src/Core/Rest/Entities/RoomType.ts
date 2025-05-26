/**
 * Enumerates the types of rooms.
 * */
export const RoomType =
	{
		/**
		 * The default type of room.
		 * */
		Standard: 0
	} as const;

Object.freeze(RoomType);

export type RoomType = typeof RoomType[keyof typeof RoomType] | number;

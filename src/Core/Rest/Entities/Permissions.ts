/**
 * Enumerates the permission flags that can be assigned to a user within the application.
 * */
export const Permissions =
{
	None: 0n,

	/**
	 * Grants the user privileges over the entire application.
	 * */
	Administrator: 1n << 0n,

	/**
	 * Allows to create, modify and remove rooms.
	 * */
	ManageRooms: 1n << 1n,

	/**
	 * Allows retrieving previously sent messages.
	 * */
	ReadMessages: 1n << 2n,

	/**
	 * Allows to send messages.
	 * */
	SendMessages: 1n << 3n,

	/**
	 * Allows to delete messages sent by other users.
	 * */
	ManageMessages: 1n << 4n,

	/**
	 * Allows the user to set their current room.
	 * */
	SetOwnCurrentRoom: 1n << 5n,

	/**
	 * Allows to set the current room of any user.
	 * */
	SetCurrentRoom: 1n << 6n,

	/**
	 * Allows to ban users from the application.
	 * */
	BanUsers: 1n << 7n,

	/**
	 * Allows to upload files to the application.
	 * */
	UploadFiles: 1n << 8n,
} as const;

Object.freeze(Permissions);

export type Permissions = typeof Permissions[keyof typeof Permissions] | bigint;

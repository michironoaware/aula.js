/**
 * Enumerates the permission flags that can be assigned to a user within the application.
 * */
export const Permissions =
	{
		None: 0n,

		/**
		 * Grants the user privileges over the entire application.
		 * */
		Administrator: 1n,

		/**
		 * Allows to create, modify and remove rooms.
		 * */
		ManageRooms: 2n,

		/**
		 * Allows retrieving previously sent messages.
		 * */
		ReadMessages: 4n,

		/**
		 * Allows to send messages.
		 * */
		SendMessages: 8n,

		/**
		 * Allows to delete messages sent by other users.
		 * */
		ManageMessages: 16n,

		/**
		 * Allows the user to set their current room.
		 * */
		SetOwnCurrentRoom: 32n,

		/**
		 * Allows to set the current room of any user.
		 * */
		SetCurrentRoom: 64n,

		/**
		 * Allows to ban users from the application.
		 * */
		BanUsers: 128n,

		/**
		 * Allows to upload files to the application.
		 * */
		UploadFiles: 256n,
	} as const;

Object.freeze(Permissions);

export type Permissions = typeof Permissions[keyof typeof Permissions] | bigint;

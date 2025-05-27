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
		 * Allows to set the current room of any user.
		 * */
		SetCurrentRoom: 32n,

		/**
		 * Allows to ban users from the application.
		 * */
		BanUsers: 64n,

		/**
		 * Allows to upload files to the application.
		 * */
		UploadFiles: 128n,

		/**
		 * Allows to modify and remove files.
		 * */
		ManageFiles: 256n,

		/**
		 * Allows to create, modify, remove and assign roles.
		 * */
		ManageRoles: 512n,

		/**
		 * Allows selecting a custom presence when connecting to the gateway.
		 * */
		UpdatePresence: 1024n,
	} as const;

Object.freeze(Permissions);

export type Permissions = typeof Permissions[keyof typeof Permissions] | bigint;

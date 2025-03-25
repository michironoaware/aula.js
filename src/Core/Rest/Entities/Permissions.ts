export const Permissions =
{
	get None()
	{
		return 0n;
	},
	get Administrator()
	{
		return 1n << 0n;
	},
	get ManageRooms()
	{
		return 1n << 1n;
	},
	get ReadMessages()
	{
		return 1n << 2n;
	},
	get SendMessages()
	{
		return 1n << 3n;
	},
	get ManageMessages()
	{
		return 1n << 4n;
	},
	get SetOwnCurrentRoom()
	{
		return 1n << 5n;
	},
	get SetCurrentRoom()
	{
		return 1n << 6n;
	},
	get BanUsers()
	{
		return 1n << 7n;
	},
}

export type Permissions = typeof Permissions[keyof typeof Permissions];

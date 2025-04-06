export const Permissions =
{
	None: 0n,
	Administrator: 1n << 0n,
	ManageRooms: 1n << 1n,
	ReadMessages: 1n << 2n,
	SendMessages: 1n << 3n,
	ManageMessages: 1n << 4n,
	SetOwnCurrentRoom: 1n << 5n,
	SetCurrentRoom: 1n << 6n,
	BanUsers: 1n << 7n,
}

Object.freeze(Permissions);

export type Permissions = typeof Permissions[keyof typeof Permissions] | bigint;

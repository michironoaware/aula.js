export enum Permissions
{
	None = 0,
	Administrator = 1 << 0,
	ManageRooms = 1 << 1,
	ReadMessages = 1 << 2,
	SendMessages = 1 << 3,
	ManageMessages = 1 << 4,
	SetOwnCurrentRoom = 1 << 5,
	SetCurrentRoom = 1 << 6,
	BanUsers = 1 << 7,
}

export interface ICreateRoomRequestBody
{
	readonly name: string;
	readonly description: string;
	readonly isEntrance?: boolean;
}

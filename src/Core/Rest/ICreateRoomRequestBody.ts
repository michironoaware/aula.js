import { RoomType } from "./Entities/RoomType.js";

export interface ICreateRoomRequestBody
{
	readonly type: RoomType;
	readonly name: string;
	readonly description: string;
	readonly isEntrance?: boolean;
}

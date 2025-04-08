export interface IModifyRoomRequestBody
{
	readonly name?: string | null;
	readonly description?: string | null;
	readonly isEntrance?: boolean | null;
	readonly backgroundAudioId?: string | null;
}

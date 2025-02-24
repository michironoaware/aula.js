export interface IGetMessagesQuery
{
	readonly before?: string;
	readonly after?: string;
	readonly count?: number;
}

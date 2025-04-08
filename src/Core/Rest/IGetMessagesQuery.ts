/**
 * Query parameters for retrieving messages.
 */
export interface IGetMessagesQuery
{
	/**
	 * An optional message id to retrieve messages sent **before** this message.
	 * Useful for paginating backwards in a message list.
	 */
	readonly before?: string;

	/**
	 * An optional message id to retrieve messages sent **after** this message.
	 * Useful for paginating forwards in a message list.
	 */
	readonly after?: string;

	/**
	 * The maximum number of messages to retrieve.
	 * If not specified, a default server-defined limit will be applied.
	 */
	readonly count?: number;
}

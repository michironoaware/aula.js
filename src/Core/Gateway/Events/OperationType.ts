/**
 * The operation type of gateway payloads.
 * */
export enum OperationType
{
	/**
	 * An event dispatch.
	 * */
	Dispatch = 0,

	/**
	 * Sent immediately after connecting, contains useful information for the client.
	 * */
	Hello = 1,
}

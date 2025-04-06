/**
 * The operation type of gateway payloads.
 * */
export const OperationType =
{
	/**
	 * An event dispatch.
	 * */
	Dispatch: 0,
} as const;

Object.freeze(OperationType);

export type OperationType = typeof OperationType[keyof typeof OperationType];

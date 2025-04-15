import { SealedClassError } from "../SealedClassError.js";

/**
 * @sealed
 * */
export class OperationCanceledError extends Error
{
	readonly #_innerError: Error | null;

	public constructor(innerError?: Error)
	{
		super("The operation was canceled.");
		SealedClassError.throwIfNotEqual(OperationCanceledError, new.target);

		this.#_innerError = innerError ?? null;
	}

	public get innerError()
	{
		return this.#_innerError;
	}
}

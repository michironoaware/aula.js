import { SealedClassError } from "../SealedClassError.js";

export class OperationCanceledError extends Error
{
	public constructor()
	{
		super("The operation was canceled.");
		SealedClassError.throwIfNotEqual(OperationCanceledError, new.target);
	}
}

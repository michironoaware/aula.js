import { ThrowHelper } from "./ThrowHelper.js";

export class InvalidOperationError extends Error
{
	public constructor(message: string)
	{
		super(message);
		ThrowHelper.TypeError.throwIfNotType(message, "string");
	}
}

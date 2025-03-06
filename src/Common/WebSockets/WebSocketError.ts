import { ThrowHelper } from "../ThrowHelper.js";
import { SealedClassError } from "../SealedClassError.js";

/**
 * Represents an error that occurred when performing an operation on a WebSocket connection.
 * */
export class WebSocketError extends Error
{
	public constructor(message: string)
	{
		super(message);
		SealedClassError.throwIfNotEqual(WebSocketError, new.target);
		ThrowHelper.TypeError.throwIfNotType(message, "string");
	}
}

import { ThrowHelper } from "../ThrowHelper";
import { SealedClassError } from "../SealedClassError";

/**
 * Represents an error that occurred when performing an operation on a WebSocket connection.
 * @sealed
 * */
export class WebSocketError extends Error
{
	/**
	 * Initializes a new instance of {@link WebSocketError}.
	 * @param message The error message.
	 * */
	public constructor(message: string)
	{
		super(message);
		SealedClassError.throwIfNotEqual(WebSocketError, new.target);
		ThrowHelper.TypeError.throwIfNotType(message, "string");
	}
}

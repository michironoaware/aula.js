import { SealedClassError } from "../SealedClassError.js";
import { WebSocketMessageType } from "./WebSocketMessageType.js";
import { ThrowHelper } from "../ThrowHelper.js";

/**
 * Represents the result of performing a single {@link WebSocket.receive} operation on a {@link WebSocket}.
 * */
export class WebSocketReceiveResult
{
	readonly #messageType: WebSocketMessageType;
	readonly #endOfMessage: boolean;
	readonly #count: number;

	public constructor(messageType: WebSocketMessageType, endOfMessage: boolean, count: number)
	{
		SealedClassError.throwIfNotEqual(WebSocketReceiveResult, new.target);
		ThrowHelper.TypeError.throwIfNotType(messageType, WebSocketMessageType);
		ThrowHelper.TypeError.throwIfNotType(endOfMessage, "boolean");
		ThrowHelper.TypeError.throwIfNotType(count, "number");

		this.#messageType = messageType;
		this.#endOfMessage = endOfMessage;
		this.#count = count;
	}

	/**
	 * The type of the current message.
	 * */
	public get messageType()
	{
		return this.#messageType;
	}

	/**
	 * Whether the message has been received completely.
	 * */
	public get endOfMessage()
	{
		return this.#endOfMessage;
	}

	/**
	 * The number of bytes that the {@link WebSocket} received.
	 * */
	public get count()
	{
		return this.#count;
	}
}

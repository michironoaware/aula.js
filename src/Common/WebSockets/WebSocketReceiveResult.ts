import { SealedClassError } from "../SealedClassError.js";
import { WebSocketMessageType } from "./WebSocketMessageType.js";
import { ThrowHelper } from "../ThrowHelper.js";

/**
 * Represents the result of performing a single {@link WebSocket.receive} operation on a {@link WebSocket}.
 * */
export class WebSocketReceiveResult
{
	readonly #_messageType: WebSocketMessageType;
	readonly #_endOfMessage: boolean;
	readonly #_count: number;

	public constructor(messageType: WebSocketMessageType, endOfMessage: boolean, count: number)
	{
		SealedClassError.throwIfNotEqual(WebSocketReceiveResult, new.target);
		ThrowHelper.TypeError.throwIfNotType(messageType, WebSocketMessageType);
		ThrowHelper.TypeError.throwIfNotType(endOfMessage, "boolean");
		ThrowHelper.TypeError.throwIfNotType(count, "number");

		this.#_messageType = messageType;
		this.#_endOfMessage = endOfMessage;
		this.#_count = count;
	}

	/**
	 * Gets the type of the current message.
	 * */
	public get messageType()
	{
		return this.#_messageType;
	}

	/**
	 * Gets whether the message has been received completely.
	 * */
	public get endOfMessage()
	{
		return this.#_endOfMessage;
	}

	/**
	 * Gets the number of bytes that the {@link WebSocket} received.
	 * */
	public get count()
	{
		return this.#_count;
	}
}

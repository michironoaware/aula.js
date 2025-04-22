import { WebSocketState } from "./WebSocketState";
import { WebSocketReceiveResult } from "./WebSocketReceiveResult";
import { WebSocketMessageType } from "./WebSocketMessageType";
import { ThrowHelper } from "../ThrowHelper";
import { HeaderMap } from "../Http/HeaderMap";
import { WebSocketCloseCode } from "./WebSocketCloseCode";
import { WebSocketError } from "./WebSocketError";
import { TypeHelper } from "../TypeHelper";
import { IAsyncDisposable } from "../IAsyncDisposable";

export abstract class ClientWebSocket implements IAsyncDisposable
{
	public headers: HeaderMap = new HeaderMap();

	/**
	 * Returns the current state of the {@link ClientWebSocket} connection.
	 * */
	public abstract state: WebSocketState;

	/**
	 * Verifies that the connection is in an expected state.
	 * @param currentState The current state of the connection.
	 * @param validStates A collection of states the {@link currentState} is expected to be.
	 * @throws WebSocketError {@link currentState} is not equal or included in the {@link validStates} collection.
	 * */
	protected static throwOnInvalidState<TState extends Array<WebSocketState> | WebSocketState>(
		currentState: WebSocketState,
		validStates: TState)
		: asserts this is { state: Exclude<WebSocketState, TState extends WebSocketState[] ? TState[number] : TState> }
	{
		ThrowHelper.TypeError.throwIfNotType(currentState, WebSocketState);
		ThrowHelper.TypeError.throwIfNotAnyType(validStates, WebSocketState, "array");
		if (TypeHelper.isType(validStates, "array"))
		{
			ThrowHelper.TypeError.throwIfNotTypeArray(validStates, WebSocketState);

			if (validStates.includes(currentState))
			{
				return;
			}

			const validStatesText = validStates.join(", ");
			throw new WebSocketError(`WebSocket is on an invalid state. Expected ${validStatesText} but got ${currentState}`);
		}

		if (currentState !== validStates)
		{
			throw new WebSocketError(`WebSocket is on an invalid state. Expected ${validStates} but got "${currentState}"`);
		}
	}

	/**
	 * Connects to a WebSocket server.
	 * */
	public abstract connect(uri: URL): Promise<void>;

	/**
	 * Receives data from the {@link ClientWebSocket} connection asynchronously.
	 * */
	public abstract receive(buffer: Uint8Array): Promise<WebSocketReceiveResult>;

	/**
	 * Sends data over the {@link ClientWebSocket} connection asynchronously.
	 * */
	public abstract send(buffer: Uint8Array, messageType: WebSocketMessageType, endOfMessage: boolean): Promise<void>;

	/**
	 * Closes the {@link ClientWebSocket} connection as an asynchronous operation.
	 * Subclasses should implement this method in a way that does not fail if the connection is not in an open state.
	 * */
	public abstract close(code: WebSocketCloseCode, reason?: string): Promise<void>;

	/**
	 * @inheritDoc
	 * */
	public abstract [Symbol.asyncDispose](): Promise<void>;
}

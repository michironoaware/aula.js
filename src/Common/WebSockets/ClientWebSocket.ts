import { WebSocketState } from "./WebSocketState.js";
import { WebSocketReceiveResult } from "./WebSocketReceiveResult.js";
import { WebSocketMessageType } from "./WebSocketMessageType.js";
import { IDisposable } from "../IDisposable.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { HeaderMap } from "../Http/HeaderMap.js";
import { WebSocketCloseCode } from "./WebSocketCloseCode.js";
import { InvalidOperationError } from "../InvalidOperationError.js";

export abstract class ClientWebSocket implements IDisposable
{
	public headers: HeaderMap = new HeaderMap();

	/**
	 * Returns the current state of the {@link ClientWebSocket} connection.
	 * */
	public abstract state: WebSocketState;

	/**
	 * Verifies that the connection is in an expected state.
	 * */
	protected static throwOnInvalidState<TArray extends Array<WebSocketState>>(currentState: WebSocketState, validStates: TArray)
		: asserts this is { state: Exclude<WebSocketState, TArray[number]> }
	{
		ThrowHelper.TypeError.throwIfNotType(currentState, WebSocketState);
		ThrowHelper.TypeError.throwIfNotTypeArray(validStates, WebSocketState);

		if (validStates.includes(currentState))
		{
			return;
		}

		const validStatesText = validStates
			.map(s => WebSocketState[s])
			.join(", ");
		throw new InvalidOperationError(`WebSocket is on an invalid state. Expected ${validStatesText} but got ${WebSocketState[currentState]}`);
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
	 * */
	public abstract close(code: WebSocketCloseCode, reason?: string): Promise<void>;

	/**
	 * @inheritDoc
	 * */
	public abstract dispose(): void;
}

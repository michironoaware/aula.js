import { SealedClassError } from "../../Common/SealedClassError.js";
import { EventEmitter } from "../../Common/Threading/EventEmitter.js";
import { Action } from "../../Common/Action.js";
import { HelloEvent } from "./Events/HelloEvent.js";
import { RestClient } from "../Rest/RestClient.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { ClientWebSocket } from "../../Common/WebSockets/ClientWebSocket.js";
import { IDisposable } from "../../Common/IDisposable.js";
import { ObjectDisposedError } from "../../Common/ObjectDisposedError.js";
import { WebSocketMessageType } from "../../Common/WebSockets/WebSocketMessageType.js";
import { UInt8Stream } from "./UInt8Stream.js";
import { WebSocketReceiveResult } from "../../Common/WebSockets/WebSocketReceiveResult.js";
import { GatewayPayload } from "./Events/Models/GatewayPayload.js";
import { WebSocketCloseCode } from "../../Common/WebSockets/WebSocketCloseCode.js";
import { WebSocketState } from "../../Common/WebSockets/WebSocketState.js";
import { Channel } from "../../Common/Threading/Channels/Channel.js";
import { OperationType } from "./Events/OperationType.js";
import { HelloOperationData } from "./Events/Models/HelloOperationData.js";
import { CommonClientWebSocket } from "./CommonClientWebSocket.js";
import { InvalidOperationError } from "../../Common/InvalidOperationError.js";
import { Intents } from "./Intents.js";
import { UpdatePresenceEventData } from "./Events/UpdatePresenceEventData.js";
import { EventType } from "./Events/EventType.js";
import { PromiseCompletionSource } from "../../Common/Threading/PromiseCompletionSource.js";
import { WebSocketError } from "../../Common/WebSockets/WebSocketError.js";
import { UnboundedChannel } from "../../Common/Threading/Channels/UnboundedChannel.js";
import { NotImplementedError } from "../../Common/NotImplementedError.js";

export class GatewayClient implements IDisposable
{
	static readonly #s_textDecoder: TextDecoder = new TextDecoder("utf8", { fatal: true });
	static readonly #s_textEncoder: TextEncoder = new TextEncoder();
	readonly #_restClient: RestClient;
	readonly #_webSocket: ClientWebSocket;
	readonly #_eventEmitter: EventEmitter<GatewayClientReceivableEvents> = new EventEmitter();
	#_pendingPayloads: Channel<PayloadSendRequest> | null = null;
	#_disconnectPromiseSource: PromiseCompletionSource<void> | null = null;
	#_uri: URL | null = null;
	#_disposed: boolean = false;

	public constructor(options: {
		restClient?: RestClient,
		webSocketType?: new () => ClientWebSocket,
	} = {})
	{
		SealedClassError.throwIfNotEqual(GatewayClient, new.target);
		ThrowHelper.TypeError.throwIfNullable(options);
		ThrowHelper.TypeError.throwIfNotAnyType(options.restClient, RestClient, "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(options.webSocketType, "function", "undefined");

		this.#_restClient = options.restClient ?? new RestClient();
		this.#_webSocket = new (options.webSocketType ?? CommonClientWebSocket)();
	}

	public get rest()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return this.#_restClient;
	}

	get #pendingPayloads()
	{
		if (this.#_pendingPayloads === null)
		{
			throw new InvalidOperationError("Pending payloads collection is null");
		}

		return this.#_pendingPayloads;
	}

	public setIntents(intents: Intents | 0)
	{
		ThrowHelper.TypeError.throwIfNotType(intents, "number");
		ObjectDisposedError.throwIf(this.#_disposed);

		if (this.#_webSocket.state !== WebSocketState.Closed)
		{
			throw new InvalidOperationError("Cannot set the gateway intents because the client is not disconnected");
		}

		this.#_webSocket.headers.delete("X-Intents");
		this.#_webSocket.headers.append("X-Intents", intents.toString());
		return this;
	}

	public setBaseUri(uri: URL)
	{
		ThrowHelper.TypeError.throwIfNotType(uri, URL);
		ObjectDisposedError.throwIf(this.#_disposed);

		if (this.#_webSocket.state !== WebSocketState.Closed)
		{
			throw new InvalidOperationError("Cannot set the base uri when the client is connected");
		}

		this.#_uri = new URL(`${uri.href}${uri.href.endsWith("/") ? "" : "/"}api/v1/gateway`);
		this.#_restClient.setBaseUri(uri);

		return this;
	}

	public setToken(token: string)
	{
		ThrowHelper.TypeError.throwIfNotType(token, "string");
		ObjectDisposedError.throwIf(this.#_disposed);

		if (this.#_webSocket.state !== WebSocketState.Closed)
		{
			throw new InvalidOperationError("Cannot set the authorization token because the client is not disconnected");
		}

		this.#_webSocket.headers.delete("Authorization");
		this.#_webSocket.headers.append("Authorization", `Bearer ${token}`);
		this.#_restClient.setToken(token);
		return this;
	}

	public async connect(sessionId?: string)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(sessionId, "string", "undefined");
		ObjectDisposedError.throwIf(this.#_disposed);

		if (this.#_webSocket.state !== WebSocketState.Closed ||
		    this.#_disconnectPromiseSource !== null)
		{
			throw new InvalidOperationError("Client is connecting or already connected");
		}

		if (this.#_uri === null)
		{
			throw new InvalidOperationError("Client's base uri is not defined");
		}

		if (!this.#_webSocket.headers.has("X-Intents"))
		{
			throw new InvalidOperationError("Gateway intents are not defined");
		}

		this.#_webSocket.headers.delete("X-SessionId");
		if (sessionId !== undefined)
		{
			this.#_webSocket.headers.append("X-SessionId", sessionId);
		}

		await this.#_webSocket.connect(this.#_uri);

		if (sessionId !== undefined)
		{
			await this.#_eventEmitter.emit("SessionResumed");
		}

		this.#_disconnectPromiseSource = new PromiseCompletionSource<void>();

		const receiveTask = this.#runPayloadReceiving();
		const sendTask = this.#runPayloadSending();

		Promise.all([ receiveTask, sendTask ]).then(() =>
		{
			this.#_disconnectPromiseSource!.resolve();
			this.#_disconnectPromiseSource = null;
			this.#_eventEmitter.emit("ClientDisconnected");
		});
	}

	public async waitForDisconnect()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		if (this.#_disconnectPromiseSource === null)
		{
			throw new InvalidOperationError("Client is not connected");
		}

		await this.#_disconnectPromiseSource.promise;
	}

	async disconnect()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		if (this.#_webSocket.state !== WebSocketState.Open)
		{
			throw new InvalidOperationError("Client is not connected");
		}

		await this.#_webSocket.close(WebSocketCloseCode.NormalClosure);
	}

	public dispose()
	{
		if (this.#_disposed)
		{
			return;
		}

		this.#_eventEmitter.dispose();
		this.#_webSocket.dispose();

		this.#_disposed = true;
	}

	public on<TEvent extends keyof GatewayClientReceivableEvents>(
		event: TEvent,
		listener: GatewayClientReceivableEvents[TEvent])
	{
		ThrowHelper.TypeError.throwIfNullable(event);
		ThrowHelper.TypeError.throwIfNotType(listener, "function");
		ObjectDisposedError.throwIf(this.#_disposed);

		return this.#_eventEmitter.on(event, listener);
	}

	public remove<TEvent extends keyof GatewayClientReceivableEvents>(
		event: TEvent,
		listener: GatewayClientReceivableEvents[TEvent])
	{
		ThrowHelper.TypeError.throwIfNullable(event);
		ThrowHelper.TypeError.throwIfNotType(listener, "function");
		ObjectDisposedError.throwIf(this.#_disposed);

		return this.#_eventEmitter.remove(event, listener);
	}

	public async updatePresence(...args: ConstructorParameters<typeof UpdatePresenceEventData>)
	{
		ThrowHelper.TypeError.throwIfNotType(args, "iterable");
		ObjectDisposedError.throwIf(this.#_disposed);

		const payload = new GatewayPayload(
			{
				operation: OperationType.Dispatch,
				event: EventType[ EventType.UpdatePresence ],
				data: new UpdatePresenceEventData(...args),
			});
		const sendPromiseSource = new PromiseCompletionSource<void>();
		const sendRequest = new PayloadSendRequest(GatewayClient.#s_textEncoder.encode(JSON.stringify(payload)), sendPromiseSource);

		await this.#pendingPayloads.writer.waitToWrite();
		await this.#pendingPayloads.writer.write(sendRequest);
		await sendPromiseSource.promise;
	}

	async #emitEventFromPayload(payload: GatewayPayload)
	{
		ThrowHelper.TypeError.throwIfNotType(payload, GatewayPayload);

		switch (payload.operation)
		{
			case OperationType.Hello:
			{
				ThrowHelper.TypeError.throwIfNotType(payload.data, HelloOperationData);
				await this.#_eventEmitter.emit("Hello", new HelloEvent(payload.data));
			}
		}

		throw new NotImplementedError();
	}

	async #runPayloadReceiving()
	{
		this.#throwIfWebSocketNotOpen();

		while (this.#_webSocket.state === WebSocketState.Open)
		{
			const payload = await this.#receivePayload();
			if (payload === null)
			{
				break;
			}

			this.#emitEventFromPayload(payload).then();
		}
	}

	async #receivePayload()
	{
		this.#throwIfWebSocketNotOpen();

		const buffer = new Uint8Array(new ArrayBuffer(1024));
		const messageBytes = new UInt8Stream(1024);
		const messageWriter = messageBytes.getWriter();

		let received: WebSocketReceiveResult;
		do
		{
			try
			{
				received = await this.#_webSocket.receive(buffer);
			}
			catch (error)
			{
				if (!(error instanceof WebSocketError))
				{
					throw error;
				}

				this.#pendingPayloads.writer.complete();
				await messageWriter.close();
				await this.#_webSocket.close(WebSocketCloseCode.NormalClosure);
				return null;
			}

			if (received.messageType === WebSocketMessageType.Close)
			{
				this.#pendingPayloads.writer.complete();
				await messageWriter.close();
				await this.#_webSocket.close(WebSocketCloseCode.NormalClosure);
				return null;
			}
			else if (received.messageType === WebSocketMessageType.Binary)
			{
				this.#pendingPayloads.writer.complete();
				await messageWriter.close();
				await this.#_webSocket.close(WebSocketCloseCode.UnsupportedData);
				return null;
			}

			await messageWriter.write(new Uint8Array(buffer.buffer, 0, received.count));
		} while (!received.endOfMessage);

		await messageWriter.close();

		try
		{
			const messageText = GatewayClient.#s_textDecoder.decode(messageBytes.written);
			return new GatewayPayload(JSON.parse(messageText));
		}
		catch (error)
		{
			if (!(error instanceof TypeError) && !(error instanceof SyntaxError))
			{
				this.#pendingPayloads.writer.complete();
				await this.#_webSocket.close(WebSocketCloseCode.InternalError);
				throw error;
			}

			this.#pendingPayloads.writer.complete();
			await this.#_webSocket.close(WebSocketCloseCode.InvalidPayloadData);
		}

		return null;
	}

	async #runPayloadSending()
	{
		this.#throwIfWebSocketNotOpen();

		this.#_pendingPayloads = new UnboundedChannel();

		while (this.#_webSocket.state === WebSocketState.Open)
		{
			await this.#sendNextPayload();
		}
	}

	async #sendNextPayload()
	{
		if (!await this.#pendingPayloads.reader.waitToRead() ||
		    this.#_webSocket.state !== WebSocketState.Open)
		{
			return;
		}

		const payloadRequest = await this.#pendingPayloads.reader.read();
		await this.#_webSocket.send(payloadRequest.payloadBytes, WebSocketMessageType.Text, true);
		payloadRequest.requestPromiseSource.resolve();
	}

	#throwIfWebSocketNotOpen()
	{
		if (this.#_webSocket.state !== WebSocketState.Open)
		{
			throw new InvalidOperationError("WebSocket must be open");
		}
	}
}

class PayloadSendRequest
{
	readonly #_payloadBytes: Uint8Array;
	readonly #_requestPromiseSource: PromiseCompletionSource<void>;

	public constructor(payloadBytes: Uint8Array, requestPromiseSource: PromiseCompletionSource<void>)
	{
		SealedClassError.throwIfNotEqual(PayloadSendRequest, new.target);
		ThrowHelper.TypeError.throwIfNotType(payloadBytes, Uint8Array);
		ThrowHelper.TypeError.throwIfNotType(requestPromiseSource, PromiseCompletionSource);

		this.#_payloadBytes = payloadBytes;
		this.#_requestPromiseSource = requestPromiseSource;
	}

	public get payloadBytes()
	{
		return this.#_payloadBytes;
	}

	public get requestPromiseSource()
	{
		return this.#_requestPromiseSource;
	}
}

interface GatewayClientReceivableEvents
{
	Hello: Action<[ HelloEvent ]>;
	ClientDisconnected: Action<[]>;
	SessionResumed: Action<[]>;
	//RoomCreated: Action<[TODO]>;
	//RoomUpdated: Action<[TODO]>;
	//RoomRemoved: Action<[TODO]>;
	//RoomConnectionCreated: Action<[TODO]>;
	//RoomConnectionRemoved: Action<[TODO]>;
	//UserUpdated: Action<[TODO]>;
	//UserCurrentRoomUpdated: Action<[TODO]>;
	//MessageCreated: Action<[TODO]>;
	//MessageRemoved: Action<[TODO]>;
	//UserStartedTyping: Action<[TODO]>;
	//UserStoppedTyping: Action<[TODO]>;
	//BanCreated: Action<[TODO]>;
	//BanRemoved: Action<[TODO]>;
}

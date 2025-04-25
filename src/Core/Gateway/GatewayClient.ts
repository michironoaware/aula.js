import { SealedClassError } from "../../Common/SealedClassError";
import { EventEmitter } from "../../Common/Threading/EventEmitter";
import { ReadyEvent } from "./ReadyEvent";
import { RestClient } from "../Rest/RestClient";
import { ThrowHelper } from "../../Common/ThrowHelper";
import { ClientWebSocket } from "../../Common/WebSockets/ClientWebSocket";
import { ObjectDisposedError } from "../../Common/ObjectDisposedError";
import { WebSocketMessageType } from "../../Common/WebSockets/WebSocketMessageType";
import { UInt8Stream } from "../../Common/IO/UInt8Stream";
import { WebSocketReceiveResult } from "../../Common/WebSockets/WebSocketReceiveResult";
import { GatewayPayload } from "./Models/GatewayPayload";
import { WebSocketCloseCode } from "../../Common/WebSockets/WebSocketCloseCode";
import { WebSocketState } from "../../Common/WebSockets/WebSocketState";
import { Channel } from "../../Common/Threading/Channels/Channel";
import { OperationType } from "./Models/OperationType";
import { ReadyEventData } from "./Models/ReadyEventData";
import { InvalidOperationError } from "../../Common/InvalidOperationError";
import { Intents } from "./Intents";
import { EventType } from "./Models/EventType";
import { PromiseCompletionSource } from "../../Common/Threading/PromiseCompletionSource";
import { WebSocketError } from "../../Common/WebSockets/WebSocketError";
import { UnboundedChannel } from "../../Common/Threading/Channels/UnboundedChannel";
import { BanData } from "../Rest/Entities/Models/BanData";
import { MessageData } from "../Rest/Entities/Models/MessageData";
import { UserStartedTypingEvent } from "./UserStartedTypingEvent";
import { UserStoppedTypingEvent } from "./UserStoppedTypingEvent";
import { RoomConnectionCreatedEvent } from "./RoomConnectionCreatedEvent";
import { RoomConnectionRemovedEvent } from "./RoomConnectionRemovedEvent";
import { UserCurrentRoomUpdatedEvent } from "./UserCurrentRoomUpdatedEvent";
import { UserTypingEventData } from "./Models/UserTypingEventData";
import { BanCreatedEvent } from "./BanCreatedEvent";
import { BanRemovedEvent } from "./BanRemovedEvent";
import { MessageCreatedEvent } from "./MessageCreatedEvent";
import { MessageRemovedEvent } from "./MessageRemovedEvent";
import { RoomCreatedEvent } from "./RoomCreatedEvent";
import { RoomUpdatedEvent } from "./RoomUpdatedEvent";
import { RoomRemovedEvent } from "./RoomRemovedEvent";
import { UserUpdatedEvent } from "./UserUpdatedEvent";
import { RoomConnectionEventData } from "./Models/RoomConnectionEventData";
import { RoomData } from "../Rest/Entities/Models/RoomData";
import { Room } from "../Rest/Entities/Room";
import { UserCurrentRoomUpdatedEventData } from "./Models/UserCurrentRoomUpdatedEventData";
import { UserData } from "../Rest/Entities/Models/UserData";
import { User } from "../Rest/Entities/User";
import { PresenceOption } from "./PresenceOption";
import { Func } from "../../Common/Func";
import { EntityFactory } from "../Rest/Entities/EntityFactory";
import { TypeHelper } from "../../Common/TypeHelper";
import { JsonReplacer } from "../../Common/Json/JsonReplacer";
import { UserPresenceUpdatedEventData } from "./Models/UserPresenceUpdatedEventData";
import { UserPresenceUpdatedEvent } from "./UserPresenceUpdatedEvent";
import { GatewayClientOptions } from "./GatewayClientOptions";
import { MessageRemovedEventData } from "./Models/MessageRemovedEventData";
import { IAsyncDisposable } from "../../Common/IAsyncDisposable";

/**
 * Provides a client to interact with the Aula Gateway API.
 * @sealed
 * */
export class GatewayClient implements IAsyncDisposable
{
	static readonly #s_textDecoder: TextDecoder = new TextDecoder("utf8", { fatal: true });
	static readonly #s_textEncoder: TextEncoder = new TextEncoder();
	readonly #_restClient: RestClient;
	readonly #_webSocket: ClientWebSocket;
	readonly #_disposeRestClient: boolean;
	readonly #_eventEmitter: EventEmitter<IGatewayClientEvents> = new EventEmitter();
	#_pendingPayloads: Channel<PayloadSendRequest> | null = null;
	#_disconnectPromiseSource: PromiseCompletionSource<void> | null = null;
	#_address: URL | null = null;
	#_disposed: boolean = false;

	/**
	 * Initializes a new instance of {@link GatewayClient}.
	 * @param options The configuration options for this client.
	 * */
	public constructor(options: GatewayClientOptions = GatewayClientOptions.default)
	{
		SealedClassError.throwIfNotEqual(GatewayClient, new.target);
		ThrowHelper.TypeError.throwIfNotType(options, GatewayClientOptions);

		this.#_restClient = options.restClient ?? new RestClient();
		this.#_disposeRestClient = options.disposeRestClient;
		this.#_webSocket = new options.webSocketType();

		if (!TypeHelper.isType(this.#_webSocket, ClientWebSocket))
		{
			throw new InvalidOperationError(`The websocket type must inherit from ${ClientWebSocket.name}.`);
		}

		if (options.address !== null)
		{
			this.withAddress(options.address);
		}

		if (options.token !== null)
		{
			this.withToken(options.token);
		}

		if (options.intents !== null)
		{
			this.withIntents(options.intents);
		}

		if (options.defaultPresence !== null)
		{
			this.setDefaultPresence(options.defaultPresence);
		}
	}

	/**
	 * The underlying {@link RestClient} instance used by this {@link GatewayClient}.
	 * */
	public get rest()
	{
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

	/**
	 * Sets the intents for the gateway connection.
	 * @param intents The intent values.
	 * @returns The current {@link GatewayClient} instance.
	 * @throws {TypeError} If {@link intents} is not a {@link bigint}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {InvalidOperationError} If the {@link GatewayClient} is connected while updating the intents.
	 * */
	public withIntents(intents: Intents)
	{
		ThrowHelper.TypeError.throwIfNotType(intents, "bigint");
		ObjectDisposedError.throwIf(this.#_disposed);

		if (this.#_webSocket.state !== WebSocketState.Closed)
		{
			throw new InvalidOperationError("Cannot set the gateway intents because the client is not disconnected");
		}

		this.#_webSocket.headers.delete("X-Intents");
		this.#_webSocket.headers.append("X-Intents", `${intents}`);
		return this;
	}

	/**
	 * Sets the address of the Aula server.
	 * @param uri A URI that points to the desired server.
	 * @returns The current {@link GatewayClient} instance.
	 * @throws {TypeError} If {@link uri} is not a {@link URL}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {InvalidOperationError} If the {@link GatewayClient} is connected while updating the address.
	 * */
	public withAddress(uri: URL)
	{
		ThrowHelper.TypeError.throwIfNotType(uri, URL);
		ObjectDisposedError.throwIf(this.#_disposed);

		if (this.#_webSocket.state !== WebSocketState.Closed)
		{
			throw new InvalidOperationError("Cannot set the base uri when the client is connected");
		}

		this.#_address = new URL(`${uri.href}${uri.href.endsWith("/") ? "" : "/"}api/v1/gateway`);
		this.#_restClient.withAddress(uri);

		return this;
	}

	/**
	 * Sets the authorization token used to authenticate the connection.
	 * @param token The token string, or `null` to clear the current token.
	 * @returns The current {@link GatewayClient} instance.
	 * @throws {TypeError} If {@link token} is not a {@link string}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {InvalidOperationError} If the {@link GatewayClient} is connected while updating the token.
	 * */
	public withToken(token: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(token, "string", "null");
		ObjectDisposedError.throwIf(this.#_disposed);

		if (this.#_webSocket.state !== WebSocketState.Closed)
		{
			throw new InvalidOperationError("Cannot set the authorization token because the client is not disconnected");
		}

		this.#_webSocket.headers.delete("Authorization");
		if (token !== null)
		{
			this.#_webSocket.headers.append("Authorization", `Bearer ${token}`);
		}

		this.#_restClient.withToken(token);
		return this;
	}

	/**
	 * Sets the presence to show once connected to the gateway.
	 * Requires the {@link Permissions.Administrator} permission,
	 * otherwise the server will ignore the provided option.
	 * If not provided with a default presence, the server will automatically fall back to {@link PresenceOption.Online}.
	 * @param presence The selected presence option.
	 * @returns The current {@link GatewayClient} instance.
	 * @throws {TypeError} If {@link presence} is not a {@link PresenceOption}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {InvalidOperationError} If the {@link GatewayClient} is connected while updating the default presence.
	 * */
	public setDefaultPresence(presence: PresenceOption)
	{
		ThrowHelper.TypeError.throwIfNotType(presence, PresenceOption);
		ObjectDisposedError.throwIf(this.#_disposed);

		if (this.#_webSocket.state !== WebSocketState.Closed)
		{
			throw new InvalidOperationError("Cannot set the default presence because the client is not disconnected");
		}

		this.#_webSocket.headers.delete("X-Presence");
		this.#_webSocket.headers.append("X-Presence", presence.toString());
		return this;
	}

	/**
	 * Connects to the server gateway.
	 * @param sessionId The ID of the session.
	 *                  If provided, an attempt will be made to resume the session;
	 *                  otherwise, a new session will be created.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {TypeError} If {@link sessionId} is not a {@link string}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {InvalidOperationError} If the client is already connected.
	 * @throws {InvalidOperationError} If the server address was not defined before connecting.
	 * @throws {InvalidOperationError} If the intents have not been defined before connecting.
	 * */
	public async connect(sessionId?: string)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(sessionId, "string", "undefined");
		ObjectDisposedError.throwIf(this.#_disposed);

		if (this.#_webSocket.state !== WebSocketState.Closed ||
		    this.#_disconnectPromiseSource !== null)
		{
			throw new InvalidOperationError("Client is connecting or already connected");
		}

		if (this.#_address === null)
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

		await this.#_webSocket.connect(this.#_address);

		if (sessionId !== undefined)
		{
			await this.#_eventEmitter.emit("Resumed");
		}

		this.#_disconnectPromiseSource = new PromiseCompletionSource<void>();

		const receiveTask = this.#runPayloadReceiving();
		const sendTask = this.#runPayloadSending();

		Promise.all([ receiveTask, sendTask ]).then(() =>
		{
			this.#_disconnectPromiseSource!.resolve();
			this.#_disconnectPromiseSource = null;
			this.#_eventEmitter.emit("Disconnected");
		});
	}

	/**
	 * @returns A promise that resolves once the gateway connection closes.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {InvalidOperationError} The client is not connected.
	 * */
	public async waitForDisconnect()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		if (this.#_disconnectPromiseSource === null)
		{
			throw new InvalidOperationError("Client is not connected");
		}

		await this.#_disconnectPromiseSource.promise;
	}

	/**
	 * Closes the current gateway connection.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {InvalidOperationError} If the client is not connected.
	 * */
	async disconnect()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		if (this.#_webSocket.state !== WebSocketState.Open)
		{
			throw new InvalidOperationError("Client is not connected");
		}

		await this.#_webSocket.close(WebSocketCloseCode.NormalClosure);
	}

	public async [Symbol.asyncDispose]()
	{
		if (this.#_disposed)
		{
			return;
		}

		this.#_eventEmitter[Symbol.dispose]();
		await this.#_webSocket[Symbol.asyncDispose]();

		if (this.#_disposeRestClient)
		{
			await this.#_restClient[Symbol.asyncDispose]();
		}

		this.#_disposed = true;
	}

	/**
	 * Sets the provided {@link listener} to listen for {@link event} events.
	 * Calling this method multiple times on the same {@link listener} will result in multiple calls to the same listener.
	 * @param event The name of the event to listen to.
	 * @param listener The function to call when the {@link event} is emitted.
	 * @throws {TypeError} If {@link event} is `null`.
	 * @throws {TypeError} If {@link listener} is not a {@link Function}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * */
	public on<TEvent extends keyof IGatewayClientEvents>(
		event: TEvent,
		listener: IGatewayClientEvents[TEvent])
	{
		ThrowHelper.TypeError.throwIfNullable(event);
		ThrowHelper.TypeError.throwIfNotType(listener, "function");
		ObjectDisposedError.throwIf(this.#_disposed);

		return this.#_eventEmitter.on(event, listener);
	}

	/**
	 * Removes the first occurrence of the provided {@link listener} for the specified {@link event}.
	 * @param event The name of the event to listen to.
	 * @param listener The function to remove for the specified {@link event}.
	 * @throws {TypeError} If {@link event} is `null`.
	 * @throws {TypeError} If {@link listener} is not a {@link Function}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * */
	public remove<TEvent extends keyof IGatewayClientEvents>(
		event: TEvent,
		listener: IGatewayClientEvents[TEvent])
	{
		ThrowHelper.TypeError.throwIfNullable(event);
		ThrowHelper.TypeError.throwIfNotType(listener, "function");
		ObjectDisposedError.throwIf(this.#_disposed);

		return this.#_eventEmitter.remove(event, listener);
	}

	/**
	 * Requests a presence update for the current user.
	 * Requires the {@link Permissions.Administrator} permission,
	 * otherwise the server will ignore the request.
	 * @param presence The new presence to show.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {TypeError} If {@link presence} is not a {@link PresenceOption}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {InvalidOperationError} If the client is not connected.
	 * */
	public async updatePresence(presence: PresenceOption)
	{
		ThrowHelper.TypeError.throwIfNotType(presence, PresenceOption);
		ObjectDisposedError.throwIf(this.#_disposed);
		if (this.#_webSocket.state !== WebSocketState.Open)
		{
			throw new InvalidOperationError("Client is not connected");
		}

		const payload =
			{
				operation: OperationType.Dispatch,
				event: EventType.UpdatePresence,
				data: { presence },
			};
		const sendPromiseSource = new PromiseCompletionSource<void>();
		const sendRequest = new PayloadSendRequest(
			GatewayClient.#s_textEncoder.encode(JSON.stringify(payload, JsonReplacer)),
			sendPromiseSource);

		if (!await this.#pendingPayloads.writer.waitToWrite())
		{
			return;
		}

		await this.#pendingPayloads.writer.write(sendRequest);
		await sendPromiseSource.promise;
	}

	async #emitEventFromPayload(payload: GatewayPayload)
	{
		ThrowHelper.TypeError.throwIfNotType(payload, GatewayPayload);

		switch (payload.operation)
		{
			case OperationType.Dispatch:
			{
				switch (payload.event)
				{
					case EventType.Ready:
						ThrowHelper.TypeError.throwIfNotType(payload.data, ReadyEventData);
						await this.#_eventEmitter.emit(
							payload.event, new ReadyEvent(payload.data, this));
						break;
					case EventType.BanCreated:
						ThrowHelper.TypeError.throwIfNotType(payload.data, BanData);
						await this.#_eventEmitter.emit(
							payload.event, new BanCreatedEvent(EntityFactory.createBan(payload.data, this.#_restClient), this));
						break;
					case EventType.BanRemoved:
						ThrowHelper.TypeError.throwIfNotType(payload.data, BanData);
						await this.#_eventEmitter.emit(
							payload.event, new BanRemovedEvent(EntityFactory.createBan(payload.data, this.#_restClient), this));
						break;
					case EventType.MessageCreated:
						ThrowHelper.TypeError.throwIfNotType(payload.data, MessageData);
						await this.#_eventEmitter.emit(
							payload.event, new MessageCreatedEvent(EntityFactory.createMessage(payload.data, this.#_restClient), this));
						break;
					case EventType.MessageRemoved:
						ThrowHelper.TypeError.throwIfNotType(payload.data, MessageData);
						await this.#_eventEmitter.emit(
							payload.event, new MessageRemovedEvent(new MessageRemovedEventData(payload.data), this));
						break;
					case EventType.UserStartedTyping:
						ThrowHelper.TypeError.throwIfNotType(payload.data, UserTypingEventData);
						await this.#_eventEmitter.emit(
							payload.event, new UserStartedTypingEvent(payload.data, this));
						break;
					case EventType.UserStoppedTyping:
						ThrowHelper.TypeError.throwIfNotType(payload.data, UserTypingEventData);
						await this.#_eventEmitter.emit(
							payload.event, new UserStoppedTypingEvent(payload.data, this));
						break;
					case EventType.RoomConnectionCreated:
						ThrowHelper.TypeError.throwIfNotType(payload.data, RoomConnectionEventData);
						await this.#_eventEmitter.emit(
							payload.event, new RoomConnectionCreatedEvent(payload.data, this));
						break;
					case EventType.RoomConnectionRemoved:
						ThrowHelper.TypeError.throwIfNotType(payload.data, RoomConnectionEventData);
						await this.#_eventEmitter.emit(
							payload.event, new RoomConnectionRemovedEvent(payload.data, this));
						break;
					case EventType.RoomCreated:
						ThrowHelper.TypeError.throwIfNotType(payload.data, RoomData);
						await this.#_eventEmitter.emit(
							payload.event, new RoomCreatedEvent(new Room(payload.data, this.#_restClient), this));
						break;
					case EventType.RoomUpdated:
						ThrowHelper.TypeError.throwIfNotType(payload.data, RoomData);
						await this.#_eventEmitter.emit(
							payload.event, new RoomUpdatedEvent(new Room(payload.data, this.#_restClient), this));
						break;
					case EventType.RoomRemoved:
						ThrowHelper.TypeError.throwIfNotType(payload.data, RoomData);
						await this.#_eventEmitter.emit(
							payload.event, new RoomRemovedEvent(new Room(payload.data, this.#_restClient), this));
						break;
					case EventType.UserCurrentRoomUpdated:
						ThrowHelper.TypeError.throwIfNotType(payload.data, UserCurrentRoomUpdatedEventData);
						await this.#_eventEmitter.emit(
							payload.event, new UserCurrentRoomUpdatedEvent(payload.data, this));
						break;
					case EventType.UserUpdated:
						ThrowHelper.TypeError.throwIfNotType(payload.data, UserData);
						await this.#_eventEmitter.emit(
							payload.event, new UserUpdatedEvent(new User(payload.data, this.#_restClient), this));
						break;
					case EventType.UserPresenceUpdated:
						ThrowHelper.TypeError.throwIfNotType(payload.data, UserPresenceUpdatedEventData);
						await this.#_eventEmitter.emit(
							payload.event, new UserPresenceUpdatedEvent(payload.data, this));
						break;
					default:
						break;
				}

				break;
			}
			default:
				break;
		}
	}

	async #runPayloadReceiving()
	{
		this.#throwIfWebSocketNotOpen();

		while (this.#_webSocket.state === WebSocketState.Open)
		{
			const message = await this.#receiveMessage();
			if (message.type === WebSocketMessageType.Close ||
			    message.type === WebSocketMessageType.Binary)
			{
				const closeCode =
					message.type === WebSocketMessageType.Binary
						? WebSocketCloseCode.UnsupportedData
						: WebSocketCloseCode.NormalClosure;

				this.#pendingPayloads.writer.complete();
				await this.#_webSocket.close(closeCode);
				break;
			}

			try
			{
				const messageText = GatewayClient.#s_textDecoder.decode(message.content);
				this.#emitEventFromPayload(new GatewayPayload(JSON.parse(messageText))).then();
			}
			catch (error)
			{
				this.#pendingPayloads.writer.complete();

				if (!(error instanceof TypeError || error instanceof SyntaxError))
				{
					await this.#_webSocket.close(WebSocketCloseCode.InternalError);
					throw error;
				}

				await this.#_webSocket.close(WebSocketCloseCode.InvalidPayloadData);
			}

		}
	}

	async #receiveMessage()
	{
		this.#throwIfWebSocketNotOpen();

		const buffer = new Uint8Array(1024);
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

				return new GatewayReceivedMessage(new Uint8Array(), WebSocketMessageType.Close);
			}

			await messageWriter.write(new Uint8Array(buffer.buffer, 0, received.count));
		} while (!received.endOfMessage);

		await messageWriter.close();
		return new GatewayReceivedMessage(messageBytes.written, received.messageType);
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

class GatewayReceivedMessage
{
	readonly #_content: Uint8Array;
	readonly #_type: WebSocketMessageType;

	public constructor(content: Uint8Array, type: WebSocketMessageType)
	{
		ThrowHelper.TypeError.throwIfNotType(content, Uint8Array);
		ThrowHelper.TypeError.throwIfNotType(type, WebSocketMessageType);

		this.#_content = content;
		this.#_type = type;
	}

	public get content()
	{
		return this.#_content;
	}

	public get type()
	{
		return this.#_type;
	}
}

export interface IGatewayClientEvents
{
	Ready: Func<[ ReadyEvent ]>;
	Disconnected: Func;
	Resumed: Func;
	BanCreated: Func<[ BanCreatedEvent ]>;
	BanRemoved: Func<[ BanRemovedEvent ]>;
	MessageCreated: Func<[ MessageCreatedEvent ]>;
	MessageRemoved: Func<[ MessageRemovedEvent ]>;
	UserStartedTyping: Func<[ UserStartedTypingEvent ]>;
	UserStoppedTyping: Func<[ UserStoppedTypingEvent ]>;
	RoomConnectionCreated: Func<[ RoomConnectionCreatedEvent ]>;
	RoomConnectionRemoved: Func<[ RoomConnectionRemovedEvent ]>;
	RoomCreated: Func<[ RoomCreatedEvent ]>;
	RoomUpdated: Func<[ RoomUpdatedEvent ]>;
	RoomRemoved: Func<[ RoomRemovedEvent ]>;
	UserUpdated: Func<[ UserUpdatedEvent ]>;
	UserCurrentRoomUpdated: Func<[ UserCurrentRoomUpdatedEvent ]>;
	UserPresenceUpdated: Func<[ UserPresenceUpdatedEvent ]>;
}

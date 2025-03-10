import { SealedClassError } from "../../Common/SealedClassError.js";
import { EventEmitter } from "../../Common/Threading/EventEmitter.js";
import { Action } from "../../Common/Action.js";
import { HelloEvent } from "./Events/HelloEvent.js";
import { RestClient } from "../Rest/RestClient.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { WebSocket } from "../../Common/WebSockets/WebSocket.js";
import { IDisposable } from "../../Common/IDisposable.js";

export class GatewayClient implements IDisposable
{
	readonly #_restClient: RestClient;
	readonly #_eventEmitter: EventEmitter<GatewayClientEvents> = new EventEmitter();
	readonly #_webSocketTypeConstructor : new (uri: URL) => WebSocket;
	readonly #_uri: URL;
	#_disposed: boolean = false;

	public constructor(options: {
		baseUri: URL,
		restClient?: RestClient,
		webSocketType: new (uri: URL) => WebSocket
	})
	{
		SealedClassError.throwIfNotEqual(GatewayClient, new.target);
		ThrowHelper.TypeError.throwIfNullable(options);
		ThrowHelper.TypeError.throwIfNotType(options.baseUri, URL);
		ThrowHelper.TypeError.throwIfNotAnyType(options.restClient, RestClient, "undefined");
		ThrowHelper.TypeError.throwIfNotType(options.webSocketType, "function");

		this.#_restClient = options.restClient ?? new RestClient().setBaseUri(options.baseUri);
		this.#_uri = new URL(`${options.baseUri.href}${options.baseUri.href.endsWith("/") ? "" : "/"}api/v1/gateway`);
		this.#_webSocketTypeConstructor = options.webSocketType;
	}

	public get restClient()
	{
		return this.#_restClient;
	}

	public async on<TEvent extends keyof GatewayClientEvents>(
		event: TEvent,
		listener: GatewayClientEvents[TEvent])
	{
		return await this.#_eventEmitter.on(event, listener);
	}

	public async remove<TEvent extends keyof GatewayClientEvents>(
		event: TEvent,
		listener: GatewayClientEvents[TEvent])
	{
		return await this.#_eventEmitter.remove(event, listener);
	}
	
	public dispose()
	{
		if (this.#_disposed)
		{
			return;
		}
		
		this.#_eventEmitter.dispose();
		
		this.#_disposed = true;
	}
}

export interface GatewayClientEvents
{
	Hello: Action<[ HelloEvent ]>;
}

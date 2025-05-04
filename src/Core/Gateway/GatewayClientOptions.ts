import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";
import { RestClient } from "../Rest/RestClient";
import { ClientWebSocket } from "../../Common/WebSockets/ClientWebSocket";
import { CommonClientWebSocket } from "./CommonClientWebSocket";
import { Intents } from "./Intents";
import { PresenceOption } from "./PresenceOption";
import { Permissions } from "../Rest/Entities/Permissions";
import { RestClientOptions } from "../Rest/RestClientOptions";

/**
 * Represents configuration options for a {@link GatewayClient}.
 * @sealed
 */
export class GatewayClientOptions
{
	static #_default: GatewayClientOptions | null = null;

	#_restClient: RestClient | null = null;
	#_restClientOptions: RestClientOptions = RestClientOptions.default;
	#_disposeRestClient: boolean = true;
	#_webSocketType: new () => ClientWebSocket = CommonClientWebSocket;
	#_token: string | null = null;
	#_address: URL | null = null;
	#_intents: Intents | null = null;
	#_defaultPresence: PresenceOption | null = null;
	#_reconnecting: boolean = true;

	/**
	 * Initializes a new instance of {@link GatewayClientOptions}.
	 */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(GatewayClientOptions, new.target);
	}

	/**
	 * Gets the default options.
	 */
	public static get default()
	{
		return this.#_default ??= new GatewayClientOptions();
	}

	/**
	 * Gets the {@link RestClient} instance used to interact with the Aula REST API.
	 * @default null
	 */
	public get restClient()
	{
		return this.#_restClient;
	}

	/**
	 * Sets the {@link RestClient} instance used to interact with the Aula REST API.
	 */
	public set restClient(restClient: RestClient | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(restClient, RestClient, "null");
		this.#_restClient = restClient;
	}

	/**
	 * Gets the configuration options that will be used to initialize the {@link RestClient} for the {@link GatewayClient},
	 * if no {@link GatewayClientOptions.restClient} is specified.
	 * @default {@link RestClientOptions.default}
	 * */
	public get restClientOptions()
	{
		return this.#_restClientOptions;
	}

	/**
	 * Sets the configuration options that will be used to initialize the {@link RestClient} for the {@link GatewayClient},
	 * if no {@link GatewayClientOptions.restClient} is specified.
	 * */
	public set restClientOptions(restClientOptions: RestClientOptions)
	{
		ThrowHelper.TypeError.throwIfNotType(restClientOptions, RestClientOptions);
		this.#_restClientOptions = restClientOptions;
	}

	/**
	 * Gets whether the {@link RestClient} should be disposed when the {@link GatewayClient} is disposed.
	 * @default true
	 */
	public get disposeRestClient()
	{
		return this.#_disposeRestClient;
	}

	/**
	 * Sets whether the {@link RestClient} should be disposed when the {@link GatewayClient} is disposed.
	 */
	public set disposeRestClient(disposeRestClient: boolean)
	{
		ThrowHelper.TypeError.throwIfNotType(disposeRestClient, "boolean");
		this.#_disposeRestClient = disposeRestClient;
	}

	/**
	 * Gets the socket class used to connect to the gateway.
	 * */
	public get webSocketType()
	{
		return this.#_webSocketType;
	}

	/**
	 * Sets the socket class used to connect to the gateway.
	 * @param webSocketType The class of the socket, must inherit from {@link ClientWebSocket} and be concrete.
	 * */
	public set webSocketType(webSocketType: new () => ClientWebSocket)
	{
		ThrowHelper.TypeError.throwIfNullable(webSocketType);
		this.#_webSocketType = webSocketType;
	}

	/**
	 * Gets the authorization token used to authenticate the connection.
	 * @default null
	 * */
	public get token()
	{
		return this.#_token;
	}

	/**
	 * Sets the authorization token used to authenticate the connection.
	 * */
	public set token(token: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(token, "string", "null");
		this.#_token = token;
	}

	/**
	 * Gets the address of the Aula server.
	 * */
	public get address()
	{
		return this.#_address;
	}

	/**
	 * Sets the address of the Aula server.
	 * */
	public set address(address: URL | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(address, URL, "null");
		this.#_address = address;
	}

	/**
	 * Gets the intents for the gateway connection.
	 * */
	public get intents()
	{
		return this.#_intents;
	}

	/**
	 * Sets the intents for the gateway connection.
	 * */
	public set intents(intents: Intents | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(intents, "bigint", "null");
		this.#_intents = intents;
	}

	/**
	 * Gets the presence to show once connected to the gateway.
	 * */
	public get defaultPresence()
	{
		return this.#_defaultPresence;
	}

	/**
	 * Sets the presence to show once connected to the gateway.
	 * */
	public set defaultPresence(defaultPresence: PresenceOption | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(defaultPresence, PresenceOption, "null");
		this.#_defaultPresence = defaultPresence;
	}

	/**
	 * Gets whether to configure the client to try and reestablish the connection if interrupted.
	 * */
	public get reconnecting()
	{
		return this.#_reconnecting;
	}

	/**
	 * Sets whether to configure the client to try and reestablish the connection if interrupted.
	 * */
	public set reconnecting(reconnecting: boolean)
	{
		ThrowHelper.TypeError.throwIfNotType(reconnecting, "boolean");
		this.#_reconnecting = reconnecting;
	}

	/**
	 * Sets the {@link RestClient} instance used to interact with the Aula REST API.
	 * @param restClient The {@link RestClient} instance to use,
	 *                   or `null` to let the GatewayClient instantiate and configure its own {@link RestClient}.
	 * @returns The current {@link GatewayClientOptions} instance.
	 */
	public withRestClient(restClient: RestClient | null)
	{
		this.restClient = restClient;
		return this;
	}

	/**
	 * Sets the configuration options that will be used to initialize the {@link RestClient} for the {@link GatewayClient},
	 * if no {@link GatewayClientOptions.restClient} is specified.
	 * @param restClientOptions The configuration options instance to use.
	 * @returns The current {@link GatewayClientOptions} instance.
	 * */
	public withRestClientOptions(restClientOptions: RestClientOptions)
	{
		this.restClientOptions = restClientOptions;
		return this;
	}

	/**
	 * Sets whether the {@link RestClient} should be disposed when the {@link GatewayClient} is disposed.
	 * @param disposeRestClient `true` to dispose the client; otherwise, `false`.
	 * @returns The current {@link GatewayClientOptions} instance.
	 */
	public withDisposeRestClient(disposeRestClient: boolean)
	{
		this.disposeRestClient = disposeRestClient;
		return this;
	}

	/**
	 * Sets the socket class used to connect to the gateway.
	 * @param webSocketType The class of the socket, must inherit from {@link ClientWebSocket} and be concrete.
	 * @returns The current {@link GatewayClientOptions} instance.
	 * */
	public withWebSocketType(webSocketType: new () => ClientWebSocket)
	{
		this.webSocketType = webSocketType;
		return this;
	}

	/**
	 * Sets the authorization token used to authenticate the connection.
	 * @param token The token string, or `null` to leave it blank.
	 * @returns The current {@link GatewayClientOptions} instance.
	 * */
	public withToken(token: string | null)
	{
		this.token = token;
		return this;
	}

	/**
	 * Sets the address of the Aula server.
	 * @param address A URI that points to the desired server, or `null` to leave it unspecified.
	 * @returns The current {@link GatewayClientOptions} instance.
	 * */
	public withAddress(address: URL | null)
	{
		this.address = address;
		return this;
	}

	/**
	 * Sets the intents for the gateway connection.
	 * @param intents The intent values, or `null` to leave it unspecified.
	 * @returns The current {@link GatewayClientOptions} instance.
	 * */
	public withIntents(intents: Intents | null)
	{
		this.intents = intents;
		return this;
	}

	/**
	 * Sets the presence to show once connected to the gateway.
	 * Requires the {@link Permissions.Administrator} permission,
	 * otherwise the server will ignore the provided option.
	 * If not provided with a default presence, the server will automatically fall back to {@link PresenceOption.Online}.
	 * @param defaultPresence The selected presence option.
	 * @returns The current {@link GatewayClientOptions} instance.
	 * */
	public withDefaultPresence(defaultPresence: PresenceOption | null)
	{
		this.defaultPresence = defaultPresence;
		return this;
	}

	/**
	 * Sets whether to configure the client to try and reestablish the connection if interrupted.
	 * @param reconnecting Whether the {@link GatewayClient} instance should attempt to reconnect.
	 * @returns The current {@link GatewayClientOptions} instance.
	 * */
	public withReconnecting(reconnecting: boolean)
	{
		this.reconnecting = reconnecting;
		return this;
	}
}

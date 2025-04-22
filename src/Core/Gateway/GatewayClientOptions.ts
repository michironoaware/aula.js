import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { RestClient } from "../Rest/RestClient.js";
import { ClientWebSocket } from "../../Common/WebSockets/ClientWebSocket.js";
import { CommonClientWebSocket } from "./CommonClientWebSocket.js";

/**
 * Represents configuration options for a {@link GatewayClient}.
 * @sealed
 */
export class GatewayClientOptions
{
	static #_default: GatewayClientOptions | null = null;

	#_restClient: RestClient | null = null;
	#_disposeRestClient: boolean = true;
	#_webSocketType: new () => ClientWebSocket = CommonClientWebSocket;
	#_token: string | null = null;

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

}

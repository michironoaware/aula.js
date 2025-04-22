import { HttpClient } from "../../Common/Http/HttpClient.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";

/**
 * Represents configuration options for a {@link RestClient}.
 * @sealed
 */
export class RestClientOptions
{
	static #_default: RestClientOptions | null = null;

	#_httpClient: HttpClient | null = null;
	#_disposeHttpClient: boolean = true;
	#_token: string | null = null;
	#_address: URL | null = null;

	/**
	 * Initializes a new instance of {@link RestClientOptions}.
	 */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(RestClientOptions, new.target);
	}

	/**
	 * Gets the default options.
	 */
	public static get default()
	{
		return this.#_default ??= new RestClientOptions();
	}

	/**
	 * Gets the {@link HttpClient} instance used for making HTTP requests.
	 * @default null
	 */
	public get httpClient()
	{
		return this.#_httpClient;
	}

	/**
	 * Sets the {@link HttpClient} instance used for making HTTP requests.
	 */
	public set httpClient(httpClient: HttpClient | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(httpClient, HttpClient, "null");
		this.#_httpClient = httpClient;
	}

	/**
	 * Gets whether the HTTP client should be disposed when the {@link RestClient} is disposed.
	 * @default true
	 */
	public get disposeHttpClient()
	{
		return this.#_disposeHttpClient;
	}

	/**
	 * Sets whether the HTTP client should be disposed when the {@link RestClient} is disposed.
	 */
	public set disposeHttpClient(disposeHttpClient: boolean)
	{
		ThrowHelper.TypeError.throwIfNotType(disposeHttpClient, "boolean");
		this.#_disposeHttpClient = disposeHttpClient;
	}

	/**
	 * Gets the authorization token used to authenticate and make requests.
	 * @default null
	 * */
	public get token()
	{
		return this.#_token;
	}

	/**
	 * Sets the authorization token used to authenticate and make requests.
	 * */
	public set token(token: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(token, "string", "null");
		this.#_token = token;
	}

	/**
	 * Gets the address of the Aula server where requests should be sent.
	 * */
	public get address()
	{
		return this.#_address;
	}

	/**
	 * Sets the address of the Aula server where requests should be sent.
	 * */
	public set address(address: URL | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(address, URL, "null");
		this.#_address = address;
	}

	/**
	 * Sets the {@link HttpClient} instance used for making HTTP requests.
	 * @param httpClient The {@link HttpClient} instance to use,
	 *                   or `null` to let the RestClient instantiate and configure its own {@link HttpClient}.
	 * @returns The current {@link RestClientOptions} instance.
	 */
	public withHttpClient(httpClient: HttpClient | null)
	{
		this.httpClient = httpClient;
		return this;
	}

	/**
	 * Sets whether the HTTP client should be disposed when the {@link RestClient} is disposed.
	 * @param disposeHttpClient `true` to dispose the client; otherwise, `false`.
	 * @returns The current {@link RestClientOptions} instance.
	 */
	public withDisposeHttpClient(disposeHttpClient: boolean)
	{
		this.disposeHttpClient = disposeHttpClient;
		return this;
	}

	/**
	 * Sets the authorization token used to authenticate and make requests.
	 * @param token The token string, or `null` to leave it blank.
	 * @returns The current {@link RestClientOptions} instance.
	 * */
	public withToken(token: string | null)
	{
		this.token = token;
		return this;
	}

	/**
	 * Sets the address of the Aula server where requests should be sent.
	 * @param address A URI that points to the desired server, or `null` to leave it unspecified.
	 * @returns The current {@link RestClientOptions} instance.
	 * */
	public withAddress(address: URL | null)
	{
		this.address = address;
		return this;
	}
}

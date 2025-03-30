/**
 * A helper class for retrieving and comparing standard HTTP methods and for creating new HTTP methods.
 * */
export class HttpMethod
{
	static readonly #s_getMethod: HttpMethod = new HttpMethod("GET");
	static readonly #s_postMethod: HttpMethod = new HttpMethod("POST");
	static readonly #s_putMethod: HttpMethod = new HttpMethod("PUT");
	static readonly #s_patchMethod: HttpMethod = new HttpMethod("PATCH");
	static readonly #s_deleteMethod: HttpMethod = new HttpMethod("DELETE");
	static readonly #s_headMethod: HttpMethod = new HttpMethod("HEAD");
	static readonly #s_optionsMethod: HttpMethod = new HttpMethod("OPTIONS");
	static readonly #s_traceMethod: HttpMethod = new HttpMethod("TRACE");
	static readonly #s_connectMethod: HttpMethod = new HttpMethod("CONNECT");

	readonly #_name: string;

	/**
	 * Creates a new {@link HttpMethod} with the specified name.
	 * @param name The name of the HTTP method.
	 * */
	constructor(name: string)
	{
		this.#_name = name;
	}

	/**
	 * Represents an HTTP GET protocol method.
	 * */
	public static get Get()
	{
		return this.#s_getMethod;
	}

	/**
	 * Represents an HTTP POST protocol method that is used to post a new entity as an addition to a URI.
	 * */
	public static get Post()
	{
		return this.#s_postMethod;
	}

	/**
	 * Represents an HTTP PUT protocol method that is used to replace an entity identified by a URI.
	 * */
	public static get Put()
	{
		return this.#s_putMethod;
	}

	/**
	 * Gets the HTTP PATCH protocol method.
	 * */
	public static get Patch()
	{
		return this.#s_patchMethod;
	}

	/**
	 * Represents an HTTP DELETE protocol method.
	 * */
	public static get Delete()
	{
		return this.#s_deleteMethod;
	}

	/**
	 * Represents an HTTP HEAD protocol method.
	 * The HEAD method is identical to GET except that the server only
	 * returns message-headers in the response, without a message-body.
	 * */
	public static get Head()
	{
		return this.#s_headMethod;
	}

	/**
	 * Represents an HTTP OPTIONS protocol method.
	 * */
	public static get Options()
	{
		return this.#s_optionsMethod;
	}

	/**
	 * Represents an HTTP TRACE protocol method.
	 * */
	public static get Trace()
	{
		return this.#s_traceMethod;
	}

	/**
	 * Gets the HTTP CONNECT protocol method.
	 * */
	public static get Connect()
	{
		return this.#s_connectMethod;
	}

	/**
	 * The name of this {@link HttpMethod}.
	 * */
	public get name()
	{
		return this.#_name;
	}
}

export class HttpMethod
{
	static readonly #_getMethod: HttpMethod = new HttpMethod("GET");
	static readonly #_postMethod: HttpMethod = new HttpMethod("POST");
	static readonly #_putMethod: HttpMethod = new HttpMethod("PUT");
	static readonly #_patchMethod: HttpMethod = new HttpMethod("PATCH");
	static readonly #_deleteMethod: HttpMethod = new HttpMethod("DELETE");
	static readonly #_headMethod: HttpMethod = new HttpMethod("HEAD");
	static readonly #_optionsMethod: HttpMethod = new HttpMethod("OPTIONS");
	static readonly #_traceMethod: HttpMethod = new HttpMethod("TRACE");
	static readonly #_connectMethod: HttpMethod = new HttpMethod("CONNECT");

	readonly #_name: string;

	constructor(name: string)
	{
		this.#_name = name;
	}

	public static get Get()
	{
		return this.#_getMethod;
	}

	public static get Post()
	{
		return this.#_postMethod;
	}

	public static get Put()
	{
		return this.#_putMethod;
	}

	public static get Patch()
	{
		return this.#_patchMethod;
	}

	public static get Delete()
	{
		return this.#_deleteMethod;
	}

	public static get Head()
	{
		return this.#_headMethod;
	}

	public static get Options()
	{
		return this.#_optionsMethod;
	}

	public static get Trace()
	{
		return this.#_traceMethod;
	}

	public static get Connect()
	{
		return this.#_connectMethod;
	}

	public get name()
	{
		return this.#_name;
	}
}

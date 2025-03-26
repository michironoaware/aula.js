import { PrivateConstructorError } from "../PrivateConstructorError.js";

export class HttpMethod
{
	static readonly #_constructorKey: symbol = Symbol();
	static readonly #_getMethod: HttpMethod = new HttpMethod(HttpMethod.#_constructorKey, "GET");
	static readonly #_postMethod: HttpMethod = new HttpMethod(HttpMethod.#_constructorKey, "POST");
	static readonly #_putMethod: HttpMethod = new HttpMethod(HttpMethod.#_constructorKey, "PUT");
	static readonly #_patchMethod: HttpMethod = new HttpMethod(HttpMethod.#_constructorKey, "PATCH");
	static readonly #_deleteMethod: HttpMethod = new HttpMethod(HttpMethod.#_constructorKey, "DELETE");
	static readonly #_headMethod: HttpMethod = new HttpMethod(HttpMethod.#_constructorKey, "HEAD");
	static readonly #_optionsMethod: HttpMethod = new HttpMethod(HttpMethod.#_constructorKey, "OPTIONS");
	static readonly #_traceMethod: HttpMethod = new HttpMethod(HttpMethod.#_constructorKey, "TRACE");
	static readonly #_connectMethod: HttpMethod = new HttpMethod(HttpMethod.#_constructorKey, "CONNECT");

	readonly #_name: string;

	constructor(constructorKey: symbol, name: string)
	{
		PrivateConstructorError.throwIfNotEqual(HttpMethod.#_constructorKey, constructorKey);
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

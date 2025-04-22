import { HttpStatusCode } from "./HttpStatusCode";
import { HttpContent } from "./HttpContent";
import { HttpRequestError } from "./HttpRequestError";
import { SealedClassError } from "../SealedClassError";
import { ThrowHelper } from "../ThrowHelper";
import { EmptyContent } from "./EmptyContent";
import { HeaderMap } from "./HeaderMap";

/**
 * Represents a HTTP response message.
 * @sealed
 * */
export class HttpResponseMessage
{
	#_statusCode: HttpStatusCode;
	#_content: HttpContent | null = null;
	#_headers: HeaderMap | null = null;

	/**
	 * Initializes a new instance of the {@link HttpResponseMessage} class with the specified status code, content and headers.
	 * @param statusCode The status code of the HTTP response.
	 * */
	public constructor(statusCode: HttpStatusCode)
	{
		SealedClassError.throwIfNotEqual(HttpResponseMessage, new.target);
		ThrowHelper.TypeError.throwIfNotType(statusCode, "number");

		this.#_statusCode = statusCode;
	}

	/**
	 * Gets the status code of the HTTP response.
	 * */
	public get statusCode()
	{
		return this.#_statusCode;
	}

	/**
	 * Sets the status code of the HTTP response.
	 * */
	public set statusCode(value: HttpStatusCode)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		this.#_statusCode = value;
	}

	/**
	 * Gets the content of a HTTP response message.
	 * */
	public get content()
	{
		return this.#_content ??= new EmptyContent();
	}

	/**
	 * Sets the content of a HTTP response message.
	 * */
	public set content(value: HttpContent)
	{
		ThrowHelper.TypeError.throwIfNotType(value, HttpContent);
		this.#_content = value;
	}

	/**
	 * Gets the collection of HTTP response headers.
	 * */
	public get headers()
	{
		return this.#_headers ??= new HeaderMap();
	}

	/**
	 * Gets a value that indicates if the HTTP response was successful.
	 * */
	public get isSuccessStatusCode()
	{
		return this.#_statusCode >= 200 && this.#_statusCode < 300;
	}

	/**
	 * Throws an exception if the {@link isSuccessStatusCode} property for the {@link HttpResponseMessage} is false.
	 * */
	public ensureSuccessStatusCode()
	{
		if (!this.isSuccessStatusCode)
		{
			throw new HttpRequestError(undefined, this.statusCode);
		}
	}
}

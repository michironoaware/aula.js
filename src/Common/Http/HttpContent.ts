import { HeaderMap } from "./HeaderMap.js";
import { IDisposable } from "../IDisposable.js";

/**
 * A base class representing an HTTP entity body and content headers.
 * */
export abstract class HttpContent implements IDisposable
{
	/**
	 * Gets the HTTP content headers as defined in {@link https://www.rfc-editor.org/rfc/rfc2616 RFC 2616}.
	 * */
	public abstract get headers(): HeaderMap;

	/**
	 * Serializes the HTTP content and returns a stream that represents the content.
	 * */
	public abstract readAsStream(): Promise<ReadableStream<Uint8Array>>;

	/**
	 * Serialize the HTTP content to a byte array as an asynchronous operation.
	 * */
	public abstract readAsByteArray(): Promise<Uint8Array>;

	/**
	 * Serialize the HTTP content to a string as an asynchronous operation.
	 * */
	public abstract readAsString(): Promise<string>;

	public abstract dispose(): void;
}

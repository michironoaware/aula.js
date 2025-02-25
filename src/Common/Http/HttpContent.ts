import {HeaderMap} from "./HeaderMap.js";

export abstract class HttpContent
{
	public abstract get headers(): HeaderMap;

	public abstract get stream(): ReadableStream<Uint8Array>;

	public abstract readAsString(): Promise<string>;
}

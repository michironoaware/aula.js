import {HeaderMap} from "./HeaderMap.js";
import {IDisposable} from "../IDisposable.js";

export abstract class HttpContent implements IDisposable
{
	public abstract get headers(): HeaderMap;

	public abstract get stream(): ReadableStream<Uint8Array>;

	public abstract readAsString(): Promise<string>;

	public abstract dispose(): void;
}

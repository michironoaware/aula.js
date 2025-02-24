export abstract class HttpContent
{
	public abstract get stream(): ReadableStream<Uint8Array>;

	public abstract readAsString(): Promise<string>;
}

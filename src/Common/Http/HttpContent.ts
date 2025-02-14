export abstract class HttpContent
{
	abstract get stream(): ReadableStream<Uint8Array>;

	abstract readAsString(): Promise<string>;
}

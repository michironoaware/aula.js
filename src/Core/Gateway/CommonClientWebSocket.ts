import { SealedClassError } from "../../Common/SealedClassError.js";
import { WebSocketMessageType } from "../../Common/WebSockets/WebSocketMessageType.js";
import { ClientWebSocket } from "../../Common/WebSockets/ClientWebSocket.js";
import { WebSocketState } from "../../Common/WebSockets/WebSocketState.js";
import { WebSocketError } from "../../Common/WebSockets/WebSocketError.js";
import { WebSocketReceiveResult } from "../../Common/WebSockets/WebSocketReceiveResult.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { TypeHelper } from "../../Common/TypeHelper.js";
import { InvalidOperationError } from "../../Common/InvalidOperationError.js";
import { PromiseCompletionSource } from "../../Common/Threading/PromiseCompletionSource.js";
import { NotSupportedError } from "../../Common/NotSupportedError.js";
import { WebSocketCloseCode } from "../../Common/WebSockets/WebSocketCloseCode.js";
import { ObjectDisposedError } from "../../Common/ObjectDisposedError.js";

export class CommonClientWebSocket extends ClientWebSocket
{
	static readonly #s_closeReceivedResult: WebSocketReceiveResult = new WebSocketReceiveResult(WebSocketMessageType.Close, true, 0);
	static readonly #s_textDecoder: TextDecoder = new TextDecoder();
	static readonly #s_textEncoder: TextEncoder = new TextEncoder();
	readonly #_messageQueue: WebSocketMessage[] = [];
	readonly #_pendingReceives: WebSocketReceive[] = [];
	#_underlyingWebSocket: WebSocket | null = null;
	#_state: WebSocketState = WebSocketState.Closed;
	#_disposed: boolean = false;

	public constructor()
	{
		super();
		SealedClassError.throwIfNotEqual(CommonClientWebSocket, new.target);
	}

	public get state()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return this.#_state;
	}

	public connect(uri: URL)
	{
		ThrowHelper.TypeError.throwIfNotType(uri, URL);
		ObjectDisposedError.throwIf(this.#_disposed);

		if (this.#_state === WebSocketState.Open || this.#_state === WebSocketState.Connecting)
		{
			throw new WebSocketError("WebSocket is already connected or connecting");
		}

		this.#_state = WebSocketState.Connecting;

		// The [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) API
		// does not allow passing headers other than Sec-WebSocket-Protocol,
		// so we are going to pass these headers inside the protocol header as a JSON object.
		// Aula servers will recognize and accept any group of headers inside Sec-WebSocket-Protocol following the specified pattern:
		// "h_{x}" where {x} is a base64url encoded JSON object containing the headers.
		const headersAsKeyValuePairObject: { [ key: string ]: string } = {};
		for (const header of this.headers)
		{
			headersAsKeyValuePairObject[ header[ 0 ] ] = header[ 1 ];
		}

		const headersAsBase64Url = btoa(JSON.stringify(headersAsKeyValuePairObject))
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/, "");

		this.#_underlyingWebSocket = new WebSocket(uri, `h_${headersAsBase64Url}`);
		this.#_underlyingWebSocket.binaryType = "arraybuffer";

		const connectPromiseSource = new PromiseCompletionSource<void>();

		this.#_underlyingWebSocket.addEventListener("open", () =>
		{
			this.#_state = WebSocketState.Open;
			connectPromiseSource.resolve();
		});

		this.#_underlyingWebSocket.addEventListener("message", (event) =>
		{
			let data: Uint8Array;
			let messageType: WebSocketMessageType;

			if (TypeHelper.isType(event.data, "string"))
			{
				data = CommonClientWebSocket.#s_textEncoder.encode(event.data);
				messageType = WebSocketMessageType.Text;
			}
			else if (TypeHelper.isType(event.data, ArrayBuffer))
			{
				data = new Uint8Array(event.data);
				messageType = WebSocketMessageType.Binary;
			}
			else
			{
				throw new WebSocketError("Unknown message type received");
			}

			this.#_messageQueue.push(new WebSocketMessage(data, messageType, 0));
			this.#processPendingReceives();
		});

		this.#_underlyingWebSocket.addEventListener("error", () =>
		{
			this.#_state = WebSocketState.Closed;
			this.#_underlyingWebSocket = null;

			connectPromiseSource.reject(new WebSocketError("A WebSocket error occurred"));
		});

		this.#_underlyingWebSocket.addEventListener("close", () =>
		{
			this.#_state = WebSocketState.Closed;
			this.#_underlyingWebSocket = null;

			while (this.#_pendingReceives.length > 0)
			{
				const pendingReceive = this.#_pendingReceives.shift();
				if (pendingReceive !== undefined)
				{
					pendingReceive.promiseSource.resolve(CommonClientWebSocket.#s_closeReceivedResult);
				}
			}
		});

		return connectPromiseSource.promise;
	}

	public receive(buffer: Uint8Array)
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		this.#throwIfNotOpen();

		if (this.#_messageQueue.length > 0)
		{
			return Promise.resolve(this.#writeMessage(buffer));
		}
		else
		{
			const promiseSource = new PromiseCompletionSource<WebSocketReceiveResult>();
			this.#_pendingReceives.push(new WebSocketReceive(buffer, promiseSource));
			return promiseSource.promise;
		}
	}

	public async send(buffer: Uint8Array, messageType: Exclude<WebSocketMessageType, WebSocketMessageType.Close>, endOfMessage: boolean)
	{
		ThrowHelper.TypeError.throwIfNotType(buffer, Uint8Array);
		ThrowHelper.TypeError.throwIfNotType(messageType, WebSocketMessageType);
		ThrowHelper.TypeError.throwIfNotType(endOfMessage, "boolean");
		ObjectDisposedError.throwIf(this.#_disposed);
		this.#throwIfNotOpen();

		if (!endOfMessage)
		{
			throw new NotSupportedError("Fragmented messages are not supported");
		}

		switch (messageType)
		{
			case WebSocketMessageType.Text:
			{
				const text = CommonClientWebSocket.#s_textDecoder.decode(buffer);
				this.#_underlyingWebSocket!.send(text);
				break;
			}
			case WebSocketMessageType.Binary:
			{
				this.#_underlyingWebSocket!.send(buffer);
				break;
			}
			default:
				throw new NotSupportedError("The specified message type is not supported");
		}

		if (this.#_underlyingWebSocket!.bufferedAmount > 0)
		{
			const bufferedAmountIsZeroPromiseSource = new PromiseCompletionSource<void>();
			const bufferCheckInterval = setInterval(() =>
			{
				if (this.#_underlyingWebSocket!.bufferedAmount === 0)
				{
					clearInterval(bufferCheckInterval);
					bufferedAmountIsZeroPromiseSource.resolve();
				}
			}, 1);

			await bufferedAmountIsZeroPromiseSource.promise;
		}
	}

	public close(code: WebSocketCloseCode, reason?: string)
	{
		ThrowHelper.TypeError.throwIfNotType(code, WebSocketCloseCode);
		ThrowHelper.TypeError.throwIfNotAnyType(reason, "string", "undefined");
		ObjectDisposedError.throwIf(this.#_disposed);
		this.#throwIfNotOpen();

		this.#_state = WebSocketState.CloseSent;

		const closePromiseSource = new PromiseCompletionSource<void>();
		this.#_underlyingWebSocket!.addEventListener("close", () => closePromiseSource.resolve());
		this.#_underlyingWebSocket!.close(code, reason);

		return closePromiseSource.promise;
	}

	public dispose()
	{
		if (this.#_disposed)
		{
			return;
		}

		this.#_underlyingWebSocket?.close(WebSocketCloseCode.NormalClosure);

		while (this.#_pendingReceives.length > 0)
		{
			const pendingReceive = this.#_pendingReceives.shift();
			if (pendingReceive !== undefined)
			{
				pendingReceive.promiseSource.reject(new ObjectDisposedError());
			}
		}

		this.#_disposed = true;
	}

	#writeMessage(buffer: Uint8Array): WebSocketReceiveResult
	{
		if (this.#_messageQueue.length === 0)
		{
			throw new InvalidOperationError("No messages available");
		}

		const currentMessage = this.#_messageQueue[ 0 ];
		const bytesAvailable = currentMessage.data.length - currentMessage.bytesRead;
		const bytesToWrite = Math.min(buffer.length, bytesAvailable);
		const totalBytesRead = currentMessage.bytesRead + bytesToWrite;
		const endOfMessage = totalBytesRead >= currentMessage.data.length;

		buffer.set(currentMessage.data.subarray(currentMessage.bytesRead, totalBytesRead));
		currentMessage.bytesRead = totalBytesRead;

		if (endOfMessage)
		{
			this.#_messageQueue.shift();
		}

		return new WebSocketReceiveResult(currentMessage.messageType, endOfMessage, bytesToWrite);
	}

	#processPendingReceives(): void
	{
		while (this.#_pendingReceives.length > 0 && this.#_messageQueue.length > 0)
		{
			const pendingReceive = this.#_pendingReceives.shift();
			if (pendingReceive !== undefined)
			{
				const receiveResult = this.#writeMessage(pendingReceive.buffer);
				pendingReceive.promiseSource.resolve(receiveResult);
			}
		}
	}

	#throwIfNotOpen(): asserts this is { state: WebSocketState.Open }
	{
		if (this.#_underlyingWebSocket === null || this.state !== WebSocketState.Open)
		{
			throw new InvalidOperationError("WebSocket is not open.");
		}
	}
}

class WebSocketMessage
{
	readonly #_data: Uint8Array;
	readonly #_messageType: WebSocketMessageType;
	#_bytesRead: number;

	public constructor(data: Uint8Array, messageType: WebSocketMessageType, bytesRead: number)
	{
		SealedClassError.throwIfNotEqual(WebSocketMessage, new.target);
		ThrowHelper.TypeError.throwIfNotType(data, Uint8Array);
		ThrowHelper.TypeError.throwIfNotType(messageType, WebSocketMessageType);
		ThrowHelper.TypeError.throwIfNotType(bytesRead, "number");

		this.#_data = data;
		this.#_messageType = messageType;
		this.#_bytesRead = bytesRead;
	}

	public get data()
	{
		return this.#_data;
	}

	public get messageType()
	{
		return this.#_messageType;
	}

	public get bytesRead()
	{
		return this.#_bytesRead;
	}

	public set bytesRead(value: number)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "number");
		this.#_bytesRead = value;
	}
}

class WebSocketReceive
{
	readonly #_buffer: Uint8Array;
	readonly #_promiseSource: PromiseCompletionSource<WebSocketReceiveResult>;

	public constructor(buffer: Uint8Array, promiseSource: PromiseCompletionSource<WebSocketReceiveResult>)
	{
		SealedClassError.throwIfNotEqual(WebSocketReceive, new.target);
		ThrowHelper.TypeError.throwIfNotType(buffer, Uint8Array);
		ThrowHelper.TypeError.throwIfNotType(promiseSource, PromiseCompletionSource);

		this.#_buffer = buffer;
		this.#_promiseSource = promiseSource;
	}

	public get buffer()
	{
		return this.#_buffer;
	}

	public get promiseSource()
	{
		return this.#_promiseSource;
	}
}

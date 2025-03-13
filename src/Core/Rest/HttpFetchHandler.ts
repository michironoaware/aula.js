import { EmptyContent } from "../../Common/Http/EmptyContent.js";
import { HttpMessageHandler } from "../../Common/Http/HttpMessageHandler.js";
import { HttpMethod } from "../../Common/Http/HttpMethod.js";
import { HttpRequestMessage } from "../../Common/Http/HttpRequestMessage.js";
import { HttpResponseMessage } from "../../Common/Http/HttpResponseMessage.js";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode.js";
import { StreamContent } from "../../Common/Http/StreamContent.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { HeaderMap } from "../../Common/Http/HeaderMap.js";
import { ObjectDisposedError } from "../../Common/ObjectDisposedError.js";

export class HttpFetchHandler extends HttpMessageHandler
{
	#disposed: boolean = false;

	constructor()
	{
		super();
		SealedClassError.throwIfNotEqual(HttpFetchHandler, new.target);
	}

	public async send(message: HttpRequestMessage)
	{
		ThrowHelper.TypeError.throwIfNotType(message, HttpRequestMessage);
		ObjectDisposedError.throwIf(this.#disposed);

		const received = await fetch(message.requestUri,
			{
				method: HttpMethod[ message.method ],
				headers: Array.from(message.headers),
				body: message.content?.stream,
				duplex: "half"
			} as RequestInit);

		const status = received.status as HttpStatusCode;
		const content = received.body ? new StreamContent(received.body) : new EmptyContent();
		const headers = new HeaderMap(received.headers);
		return new HttpResponseMessage(status, content, headers);
	}

	public dispose()
	{
		if (this.#disposed)
		{
			return;
		}

		this.#disposed = true;
	}
}

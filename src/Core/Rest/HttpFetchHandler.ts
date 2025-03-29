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
	#_disposed: boolean = false;

	constructor()
	{
		super();
		SealedClassError.throwIfNotEqual(HttpFetchHandler, new.target);
	}

	public async send(message: HttpRequestMessage)
	{
		ThrowHelper.TypeError.throwIfNotType(message, HttpRequestMessage);
		ObjectDisposedError.throwIf(this.#_disposed);

		const received = await fetch(message.requestUri,
			{
				method: HttpMethod.name,
				headers: Array.from(message.headers),
				body: message.content?.readAsStream(),
				duplex: "half"
			} as RequestInit);

		const response = new HttpResponseMessage(received.status as HttpStatusCode);
		response.content = received.body ? new StreamContent(received.body) : response.content;
	}

	public dispose()
	{
		if (this.#_disposed)
		{
			return;
		}

		this.#_disposed = true;
	}
}

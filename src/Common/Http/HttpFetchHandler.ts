import { EmptyContent } from "./EmptyContent.js";
import { HttpMessageHandler } from "./HttpMessageHandler.js";
import { HttpMethod } from "./HttpMethod.js";
import { HttpRequestMessage } from "./HttpRequestMessage.js";
import { HttpResponseMessage } from "./HttpResponseMessage.js";
import { HttpStatusCode } from "./HttpStatusCode.js";
import { StreamContent } from "./StreamContent.js";
import {SealedClassError} from "../SealedClassError.js";
import {ThrowHelper} from "../ThrowHelper.js";
import {HeaderMap} from "./HeaderMap.js";

export class HttpFetchHandler extends HttpMessageHandler
{
	constructor()
	{
		super();
		SealedClassError.throwIfNotEqual(HttpFetchHandler, new.target);
	}

	public async send(message: HttpRequestMessage): Promise<HttpResponseMessage>
	{
		ThrowHelper.TypeError.throwIfNotType(message, HttpRequestMessage);

		const received = await fetch(message.requestUri,
			{
				method: HttpMethod[message.method],
				headers: Array.from(message.headers),
				body: message.content?.stream,
				duplex: "half"
			} as RequestInit);

		const status = received.status as HttpStatusCode;
		const content = received.body ? new StreamContent(received.body) : new EmptyContent();
		const headers = new HeaderMap(received.headers);
		return new HttpResponseMessage(status, content, headers);
	}
}

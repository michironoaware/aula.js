import {HttpClient} from "./HttpClient.js";
import {HttpRequestMessage} from "./HttpRequestMessage.js";
import {HttpResponseMessage} from "./HttpResponseMessage.js";
import {HttpMethod} from "./HttpMethod.js";
import {HttpStatusCode} from "./HttpStatusCode.js";
import {StreamContent} from "./StreamContent.js";
import {EmptyContent} from "./EmptyContent.js";
import {HeaderMap} from "./HeaderMap.js";

export class FetchHttpClient extends HttpClient
{
	#baseUri: URL | string | null = null;
	#defaultRequestHeaders: HeaderMap = new HeaderMap();

	public get baseUri()
	{
		return this.#baseUri;
	}

	public set baseUri(value: URL | string | null)
	{
		this.#baseUri = value;
	}

	public get defaultRequestHeaders()
	{
		return this.#defaultRequestHeaders;
	}

	public async Send(message: HttpRequestMessage): Promise<HttpResponseMessage>
	{
		const received = await fetch(new URL(message.requestUri, this.#baseUri ?? undefined),
			{
				method: HttpMethod[message.method],
				headers: Array.from(this.#defaultRequestHeaders).concat(Array.from(message.headers)),
				body: message.content?.stream
			});

		const status = received.status as HttpStatusCode;
		const content = received.body ? new StreamContent(received.body) : EmptyContent.Instance;
		const headers = new Map<string, string>(received.headers);
		return new HttpResponseMessage(status, content, headers);
	}
}

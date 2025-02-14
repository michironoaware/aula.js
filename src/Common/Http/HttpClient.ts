import {HttpRequestMessage} from "./HttpRequestMessage.js";
import {HttpResponseMessage} from "./HttpResponseMessage.js";
import {HeaderMap} from "./HeaderMap.js";

export abstract class HttpClient
{
	abstract baseUri: URL | string | null;
	abstract defaultRequestHeaders: HeaderMap;

	abstract Send(message: HttpRequestMessage): Promise<HttpResponseMessage>;
}

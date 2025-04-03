import { HttpMessageHandler } from "../../Common/Http/HttpMessageHandler.js";
import { HttpRequestMessage } from "../../Common/Http/HttpRequestMessage.js";
import { HttpResponseMessage } from "../../Common/Http/HttpResponseMessage.js";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode.js";
import { StreamContent } from "../../Common/Http/StreamContent.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { CancellationToken } from "../../Common/Threading/CancellationToken.js";

export class HttpFetchHandler extends HttpMessageHandler
{
	constructor()
	{
		super();
		SealedClassError.throwIfNotEqual(HttpFetchHandler, new.target);
	}

	public async send(message: HttpRequestMessage, cancellationToken: CancellationToken)
	{
		ThrowHelper.TypeError.throwIfNotType(message, HttpRequestMessage);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);

		let abortSignal: AbortSignal | null = null;
		if (cancellationToken != CancellationToken.none)
		{
			const abortController = new AbortController();
			abortSignal = abortController.signal;
			cancellationToken.on("Cancelled", () => abortController.abort());
		}

		const received = await fetch(message.requestUri,
			{
				method: message.method.name,
				headers: Array.from(message.headers).map(v => [ v[0], v[1].join(";") ]),
				body: await message.content?.readAsStream(),
				duplex: "half",
				abort: abortSignal,
			} as RequestInit);

		const response = new HttpResponseMessage(received.status as HttpStatusCode);
		response.content = received.body ? new StreamContent(received.body) : response.content;
		for (const header of received.headers)
		{
			const headerName = header[0];
			const headerValues = header[1].split(";");
			for (const headerValue of headerValues)
			{
				response.headers.append(headerName, headerValue);
			}
		}

		return response;
	}

	public dispose()
	{
	}
}

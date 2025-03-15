import { SealedClassError } from "../../Common/SealedClassError.js";
import { DelegatingHandler } from "../../Common/Http/DelegatingHandler.js";
import { HttpMessageHandler } from "../../Common/Http/HttpMessageHandler.js";
import { HttpRequestMessage } from "../../Common/Http/HttpRequestMessage.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { Action } from "../../Common/Action.js";
import { ObjectDisposedError } from "../../Common/ObjectDisposedError.js";
import { HttpMethod } from "../../Common/Http/HttpMethod.js";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode.js";

export class HttpLoggingHandler extends DelegatingHandler
{
	readonly #log: Action<[ string ]>;
	readonly #sensitiveLogging: boolean;
	readonly #headerLogging: boolean;
	#disposed: boolean = false;

	public constructor(
		innerHandler: HttpMessageHandler, logFunc: Action<[ string ]>,
		sensitiveLogging: boolean = false,
		headerLogging: boolean = false)
	{
		super(innerHandler);
		SealedClassError.throwIfNotEqual(HttpLoggingHandler, new.target);
		ThrowHelper.TypeError.throwIfNotType(logFunc, "function");
		ThrowHelper.TypeError.throwIfNotType(sensitiveLogging, "boolean");
		ThrowHelper.TypeError.throwIfNotType(headerLogging, "boolean");

		this.#log = logFunc;
		this.#sensitiveLogging = sensitiveLogging;
		this.#headerLogging = headerLogging;
	}

	public async send(message: HttpRequestMessage)
	{
		ObjectDisposedError.throwIf(this.#disposed);

		const response = await super.send(message);

		let text =
			`${HttpMethod[message.method]} to ${message.requestUri} ` +
			`${response.isSuccessStatusCode ? "Succeeded" : "Failed"} ` +
			`with status code ${response.statusCode} ${HttpStatusCode[response.statusCode] ?? ""}.`;

		if (this.#headerLogging)
		{
			text += "- Request headers:\n";
			for (const header of message.headers)
			{
				let headerName = header[0];
				let headerValue = header[1];

				if (!this.#sensitiveLogging && header[0] === "authorization")
				{
					headerValue = "***";
				}

				text += `    ${headerName}: ${headerValue}\n`;
			}

			text += `- Response headers:\n`;
			for (const header of response.headers)
			{
				text += `    ${header[0]}: ${header[1]}\n`;
			}
		}

		this.#log(text);

		return response;
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

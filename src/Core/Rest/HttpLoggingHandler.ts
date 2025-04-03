import { SealedClassError } from "../../Common/SealedClassError.js";
import { DelegatingHandler } from "../../Common/Http/DelegatingHandler.js";
import { HttpMessageHandler } from "../../Common/Http/HttpMessageHandler.js";
import { HttpRequestMessage } from "../../Common/Http/HttpRequestMessage.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { ObjectDisposedError } from "../../Common/ObjectDisposedError.js";
import { HttpMethod } from "../../Common/Http/HttpMethod.js";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode.js";
import { Func } from "../../Common/Func.js";

export class HttpLoggingHandler extends DelegatingHandler
{
	readonly #_log: Func<[ string ]>;
	readonly #_sensitiveLogging: boolean;
	readonly #_headerLogging: boolean;
	#_disposed: boolean = false;

	public constructor(
		innerHandler: HttpMessageHandler, logFunc: Func<[ string ]>,
		sensitiveLogging: boolean = false,
		headerLogging: boolean = false)
	{
		super(innerHandler);
		SealedClassError.throwIfNotEqual(HttpLoggingHandler, new.target);
		ThrowHelper.TypeError.throwIfNotType(logFunc, "function");
		ThrowHelper.TypeError.throwIfNotType(sensitiveLogging, "boolean");
		ThrowHelper.TypeError.throwIfNotType(headerLogging, "boolean");

		this.#_log = logFunc;
		this.#_sensitiveLogging = sensitiveLogging;
		this.#_headerLogging = headerLogging;
	}

	public async send(message: HttpRequestMessage)
	{
		ThrowHelper.TypeError.throwIfNotType(message, HttpRequestMessage);
		ObjectDisposedError.throwIf(this.#_disposed);

		const response = await super.send(message);

		let text =
			`${HttpMethod.name} to ${message.requestUri} ` +
			`${response.isSuccessStatusCode ? "Succeeded" : "Failed"} ` +
			`with status code ${response.statusCode} ${HttpStatusCode[response.statusCode] ?? ""}.`;

		if (this.#_headerLogging)
		{
			text += "- Request headers:\n";
			for (const header of message.headers)
			{
				let headerName = header[0];
				let headerValue = header[1];

				if (!this.#_sensitiveLogging && header[0] === "authorization")
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

		this.#_log(text);

		return response;
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

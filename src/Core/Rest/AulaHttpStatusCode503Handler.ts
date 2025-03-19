import { SealedClassError } from "../../Common/SealedClassError.js";
import { DelegatingHandler } from "../../Common/Http/DelegatingHandler.js";
import { HttpMessageHandler } from "../../Common/Http/HttpMessageHandler.js";
import { HttpRequestMessage } from "../../Common/Http/HttpRequestMessage.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { ObjectDisposedError } from "../../Common/ObjectDisposedError.js";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode.js";
import { HttpResponseMessage } from "../../Common/Http/HttpResponseMessage.js";

export class AulaHttpStatusCode503Handler extends DelegatingHandler
{
	#_disposed: boolean = false;

	public constructor(innerHandler: HttpMessageHandler)
	{
		super(innerHandler);
		SealedClassError.throwIfNotEqual(AulaHttpStatusCode503Handler, new.target);
	}

	public async send(message: HttpRequestMessage)
	{
		ThrowHelper.TypeError.throwIfNotType(message, HttpRequestMessage);
		ObjectDisposedError.throwIf(this.#_disposed);

		let response: HttpResponseMessage;
		do
		{
			response = await super.send(message);
		} while (response.statusCode === HttpStatusCode.InternalServerError);

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

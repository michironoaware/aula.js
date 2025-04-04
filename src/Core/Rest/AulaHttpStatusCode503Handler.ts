import { SealedClassError } from "../../Common/SealedClassError.js";
import { DelegatingHandler } from "../../Common/Http/DelegatingHandler.js";
import { HttpMessageHandler } from "../../Common/Http/HttpMessageHandler.js";
import { HttpRequestMessage } from "../../Common/Http/HttpRequestMessage.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode.js";
import { HttpResponseMessage } from "../../Common/Http/HttpResponseMessage.js";
import { Delay } from "../../Common/Threading/Delay.js";
import { CancellationToken } from "../../Common/Threading/CancellationToken.js";

export class AulaHttpStatusCode503Handler extends DelegatingHandler
{
	public constructor(innerHandler: HttpMessageHandler, disposeInnerHandler: boolean)
	{
		super(innerHandler, disposeInnerHandler);
		SealedClassError.throwIfNotEqual(AulaHttpStatusCode503Handler, new.target);
	}

	public async send(message: HttpRequestMessage, cancellationToken: CancellationToken)
	{
		ThrowHelper.TypeError.throwIfNotType(message, HttpRequestMessage);

		let retryDelayMilliseconds = 0;
		let response: HttpResponseMessage;
		do
		{
			if (retryDelayMilliseconds !== 0)
			{
				await Delay(retryDelayMilliseconds);
			}
			else
			{
				retryDelayMilliseconds = 100;
			}

			if (retryDelayMilliseconds < 51_200)
			{
				retryDelayMilliseconds *= 2;
			}

			response = await super.send(message, cancellationToken);
		} while (response.statusCode === HttpStatusCode.InternalServerError);

		return response;
	}
}

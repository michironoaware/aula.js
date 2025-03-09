import { SealedClassError } from "../SealedClassError.js";
import { CancellationToken } from "./CancellationToken.js";

export class CancellationTokenSource
{
	#_cancellationRequested: boolean = false;
	#_token: CancellationToken | null = null;

	public constructor()
	{
		SealedClassError.throwIfNotEqual(CancellationTokenSource, new.target);
	}

	public get IsCancellationRequested()
	{
		return this.#_cancellationRequested;
	}

	public cancel()
	{
		this.#_cancellationRequested = true;
	}

	public get token()
	{
		return this.#_token ??= new CancellationToken(this);
	}
}

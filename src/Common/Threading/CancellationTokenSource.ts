import { SealedClassError } from "../SealedClassError.js";

export class CancellationTokenSource
{
	#_cancellationRequested: boolean = false;

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
}

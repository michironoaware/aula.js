import { SealedClassError } from "../SealedClassError.js";
import { CancellationTokenSource } from "./CancellationTokenSource.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { OperationCanceledError } from "./OperationCanceledError.js";

export class CancellationToken
{
	readonly #_source: CancellationTokenSource;

	public constructor(source: CancellationTokenSource)
	{
		SealedClassError.throwIfNotEqual(CancellationToken, new.target);
		ThrowHelper.TypeError.throwIfNotType(source, CancellationTokenSource);

		this.#_source = source;
	}

	public get isCancellationRequested()
	{
		return this.#_source.isCancellationRequested;
	}

	public throwIfCancellationRequested()
	{
		if (this.#_source.isCancellationRequested)
		{
			throw new OperationCanceledError();
		}
	}
}

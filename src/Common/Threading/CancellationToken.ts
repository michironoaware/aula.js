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

	public get IsCancellationRequested()
	{
		return this.#_source.IsCancellationRequested;
	}

	public ThrowIfCancellationRequested()
	{
		if (this.#_source.IsCancellationRequested)
		{
			throw new OperationCanceledError();
		}
	}
}

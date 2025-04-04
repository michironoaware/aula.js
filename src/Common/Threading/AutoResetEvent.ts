import { ThrowHelper } from "../ThrowHelper.js";
import { SealedClassError } from "../SealedClassError.js";
import { IDisposable } from "../IDisposable.js";
import { ObjectDisposedError } from "../ObjectDisposedError.js";
import { PromiseCompletionSource } from "./PromiseCompletionSource.js";
import { CancellationToken } from "./CancellationToken.js";
import { OperationCanceledError } from "./OperationCanceledError.js";

export class AutoResetEvent implements IDisposable
{
	readonly #_queue: PromiseCompletionSource<void>[] = [];
	#_signaled: boolean;
	#_disposed: boolean = false;

	constructor(initialState: boolean)
	{
		SealedClassError.throwIfNotEqual(AutoResetEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(initialState, "boolean");

		this.#_signaled = initialState;
	}

	public async waitOne(cancellationToken: CancellationToken = CancellationToken.none)
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		if (this.#_signaled)
		{
			this.#_signaled = false;
			return Promise.resolve();
		}

		const promiseSource = new PromiseCompletionSource<void>();
		if (cancellationToken !== CancellationToken.none)
		{
			cancellationToken.on("Cancelled", () => promiseSource.reject(new OperationCanceledError()));
		}

		this.#_queue.push(promiseSource);
		return promiseSource.promise;
	}

	public set()
	{
		ObjectDisposedError.throwIf(this.#_disposed);

		if (this.#_signaled)
		{
			return;
		}

		this.#_signaled = true;
		this.#_queue.shift()?.resolve();
	}

	public reset()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		this.#_signaled = false;
	}

	public dispose()
	{
		if (this.#_disposed)
		{
			return;
		}

		for (const promiseSource of this.#_queue)
		{
			promiseSource.resolve();
		}

		this.#_disposed = true;
	}
}

import { ThrowHelper } from "../ThrowHelper.js";
import { ValueOutOfRangeError } from "../ValueOutOfRangeError.js";
import { SemaphoreFullError } from "./SemaphoreFullError.js";
import { SealedClassError } from "../SealedClassError.js";
import { IDisposable } from "../IDisposable.js";
import { ObjectDisposedError } from "../ObjectDisposedError.js";
import { PromiseCompletionSource } from "./PromiseCompletionSource.js";
import { OperationCanceledError } from "./OperationCanceledError.js";
import { CancellationToken } from "./CancellationToken.js";

export class Semaphore implements IDisposable
{
	readonly #_queue: PromiseCompletionSource<void>[] = [];
	readonly #_maximumCount: number;
	#_availableCount: number;
	#_disposed: boolean = false;

	constructor(initialCount: number, maximumCount: number)
	{
		SealedClassError.throwIfNotEqual(Semaphore, new.target);
		ThrowHelper.TypeError.throwIfNotType(initialCount, "number");
		ThrowHelper.TypeError.throwIfNotType(maximumCount, "number");
		ValueOutOfRangeError.throwIfLessThan(initialCount, 0);
		ValueOutOfRangeError.throwIfLessThan(maximumCount, 1);
		ValueOutOfRangeError.throwIfGreaterThan(initialCount, maximumCount);

		this.#_availableCount = initialCount;
		this.#_maximumCount = maximumCount;
	}

	public async waitOne(cancellationToken: CancellationToken = CancellationToken.none)
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		if (this.#_availableCount > 0)
		{
			this.#_availableCount--;
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

	public release(releaseCount: number = 1)
	{
		ThrowHelper.TypeError.throwIfNotType(releaseCount, "number");
		ObjectDisposedError.throwIf(this.#_disposed);
		ValueOutOfRangeError.throwIfLessThan(releaseCount, 1);

		for (let i = 0; i < releaseCount; i++)
		{
			if (this.#_availableCount === this.#_maximumCount)
			{
				throw new SemaphoreFullError();
			}

			this.#_availableCount += 1;
			this.#_queue.shift()?.resolve();
		}
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

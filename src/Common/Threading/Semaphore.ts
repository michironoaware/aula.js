﻿import { ThrowHelper } from "../ThrowHelper";
import { ValueOutOfRangeError } from "../ValueOutOfRangeError";
import { SemaphoreFullError } from "./SemaphoreFullError";
import { SealedClassError } from "../SealedClassError";
import { IDisposable } from "../IDisposable";
import { ObjectDisposedError } from "../ObjectDisposedError";
import { PromiseCompletionSource } from "./PromiseCompletionSource";
import { OperationCanceledError } from "./OperationCanceledError";
import { CancellationToken } from "./CancellationToken";

/**
 * @sealed
 * */
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
		cancellationToken.onCancelled(() => promiseSource.reject(new OperationCanceledError()));

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

			const dequeued = this.#_queue.shift();
			if (dequeued !== undefined)
			{
				dequeued.resolve();
				continue;
			}

			this.#_availableCount += 1;
		}
	}

	public [Symbol.dispose]()
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

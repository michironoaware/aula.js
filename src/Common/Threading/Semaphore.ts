import { ThrowHelper } from "../ThrowHelper.js";
import { ValueOutOfRangeError } from "../ValueOutOfRangeError.js";
import { SemaphoreFullError } from "./SemaphoreFullError.js";
import { Action } from "../Action.js";
import { SealedClassError } from "../SealedClassError.js";
import { IDisposable } from "../IDisposable.js";
import { ObjectDisposedError } from "../ObjectDisposedError.js";

export class Semaphore implements IDisposable
{
	readonly #_queue: Action<[]>[] = [];
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

	public async waitOne()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return new Promise<void>((resolve, reject) =>
		{
			const tryGetLock = () =>
			{
				ObjectDisposedError.throwIf(this.#_disposed);

				if (this.#_availableCount > 0)
				{
					this.#_availableCount--;
					resolve();
				}
				else
				{
					this.#_queue.push(tryGetLock);
				}
			};

			tryGetLock();
		});
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
			this.#_queue.shift()?.();
		}
	}

	public dispose()
	{
		if (this.#_disposed)
		{
			return;
		}

		for (const tryGetLock of this.#_queue)
		{
			tryGetLock();
		}

		this.#_disposed = true;
	}
}

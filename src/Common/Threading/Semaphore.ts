import {ThrowHelper} from "../ThrowHelper.js";
import {InvalidOperationError} from "../InvalidOperationError.js";
import {ValueOutOfRangeError} from "../../ValueOutOfRangeError.js";
import {SemaphoreFullError} from "./SemaphoreFullError.js";
import {Action} from "../Action.js";
import {SealedClassError} from "../SealedClassError.js";

export class Semaphore {

	readonly #queue: Action<[]>[] = [];
	readonly #maximumCount: number;
	#availableCount: number;

	constructor(initialCount: number = 0, maximumCount: number = 1)
	{
		SealedClassError.throwIfNotEqual(Semaphore, new.target);
		ThrowHelper.TypeError.throwIfNotType(initialCount, "number");
		ThrowHelper.TypeError.throwIfNotType(maximumCount, "number");
		ValueOutOfRangeError.throwIfLessThan(initialCount, 0);
		ValueOutOfRangeError.throwIfLessThan(maximumCount, 1);
		ValueOutOfRangeError.throwIfGreaterThan(initialCount, maximumCount);

		this.#availableCount = initialCount;
		this.#maximumCount = maximumCount;
	}

	public async waitOne()
	{
		return new Promise<void>(resolve =>
		{
			const tryGetLock = () =>
			{
				if(this.#availableCount > 0)
				{
					this.#availableCount--;
					resolve();
				}
				else
				{
					this.#queue.push(tryGetLock);
				}
			}

			tryGetLock();
		});
	}

	public release(releaseCount: number = 1)
	{
		ThrowHelper.TypeError.throwIfNotType(releaseCount, "number");
		ValueOutOfRangeError.throwIfLessThan(releaseCount, 1);

		for (let i = 0; i < releaseCount; i++)
		{
			if (this.#availableCount === this.#maximumCount)
			{
				throw new SemaphoreFullError();
			}

			this.#availableCount += 1;
			this.#queue.shift()?.();
		}
	}
}

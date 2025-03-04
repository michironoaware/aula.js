import { ThrowHelper } from "../ThrowHelper.js";
import { Action } from "../Action.js";
import { SealedClassError } from "../SealedClassError.js";
import { IDisposable } from "../IDisposable.js";
import { ObjectDisposedError } from "../ObjectDisposedError.js";

export class AutoResetEvent implements IDisposable
{
	readonly #queue: Action<[]>[] = [];
	#signaled: boolean;
	#disposed: boolean = false;

	constructor(initialState: boolean)
	{
		SealedClassError.throwIfNotEqual(AutoResetEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(initialState, "boolean");

		this.#signaled = initialState;
	}

	public async waitOne()
	{
		ObjectDisposedError.throwIf(this.#disposed);
		return new Promise<void>(resolve =>
		{
			const tryGetLock = () =>
			{
				ObjectDisposedError.throwIf(this.#disposed);

				if (this.#signaled)
				{
					this.#signaled = false;
					resolve();
				}
				else
				{
					this.#queue.push(tryGetLock);
				}
			};

			tryGetLock();
		});
	}

	public set()
	{
		ObjectDisposedError.throwIf(this.#disposed);

		if (this.#signaled)
		{
			return;
		}

		this.#signaled = true;
		this.#queue.shift()?.();
	}

	public reset()
	{
		ObjectDisposedError.throwIf(this.#disposed);
		this.#signaled = false;
	}

	public dispose()
	{
		if (this.#disposed)
		{
			return;
		}

		for (const tryGetLock of this.#queue)
		{
			tryGetLock();
		}

		this.#disposed = true;
	}
}

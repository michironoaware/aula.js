import { ThrowHelper } from "../ThrowHelper.js";
import { SealedClassError } from "../SealedClassError.js";
import { IDisposable } from "../IDisposable.js";
import { ObjectDisposedError } from "../ObjectDisposedError.js";
import { Func } from "../Func.js";

export class AutoResetEvent implements IDisposable
{
	readonly #_queue: Func[] = [];
	#_signaled: boolean;
	#_disposed: boolean = false;

	constructor(initialState: boolean)
	{
		SealedClassError.throwIfNotEqual(AutoResetEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(initialState, "boolean");

		this.#_signaled = initialState;
	}

	public async waitOne()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		return new Promise<void>(resolve =>
		{
			const tryGetLock = () =>
			{
				ObjectDisposedError.throwIf(this.#_disposed);

				if (this.#_signaled)
				{
					this.#_signaled = false;
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

	public set()
	{
		ObjectDisposedError.throwIf(this.#_disposed);

		if (this.#_signaled)
		{
			return;
		}

		this.#_signaled = true;
		this.#_queue.shift()?.();
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

		for (const tryGetLock of this.#_queue)
		{
			tryGetLock();
		}

		this.#_disposed = true;
	}
}

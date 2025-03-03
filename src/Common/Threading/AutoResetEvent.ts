import {ThrowHelper} from "../ThrowHelper.js";
import {Action} from "../Action.js";
import {SealedClassError} from "../SealedClassError.js";

export class AutoResetEvent
{
	readonly #queue: Action<[]>[] = [];
	#signaled: boolean;

	constructor(initialState: boolean)
	{
		SealedClassError.throwIfNotEqual(AutoResetEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(initialState, "boolean");

		this.#signaled = initialState;
	}

	public async waitOne()
	{
		return new Promise<void>(resolve =>
		{
			const tryGetLock = () =>
			{
				if(this.#signaled)
				{
					this.#signaled = false;
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

	public set()
	{
		if (this.#signaled)
		{
			return;
		}

		this.#signaled = true;
		this.#queue.shift()?.();
	}

	public reset()
	{
		this.#signaled = false;
	}
}

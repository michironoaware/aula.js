import { ThrowHelper } from "../ThrowHelper";
import { SealedClassError } from "../SealedClassError";
import { IDisposable } from "../IDisposable";
import { ObjectDisposedError } from "../ObjectDisposedError";
import { PromiseCompletionSource } from "./PromiseCompletionSource";
import { CancellationToken } from "./CancellationToken";
import { OperationCanceledError } from "./OperationCanceledError";

/**
 * @sealed
 * */
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
		cancellationToken.onCancelled(() => promiseSource.reject(new OperationCanceledError()));

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

		const dequeued = this.#_queue.shift();
		if (dequeued !== undefined)
		{
			dequeued.resolve();
			return;
		}

		this.#_signaled = true;
	}

	public reset()
	{
		ObjectDisposedError.throwIf(this.#_disposed);
		this.#_signaled = false;
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

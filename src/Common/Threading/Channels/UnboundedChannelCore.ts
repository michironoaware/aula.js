import { SealedClassError } from "../../SealedClassError.js";
import { InvalidOperationError } from "../../InvalidOperationError.js";
import { PromiseCompletionSource } from "../PromiseCompletionSource.js";

export class UnboundedChannelCore<T>
{
	readonly #_items: T[] = [];
	readonly #_readersWaiting: PromiseCompletionSource<boolean>[] = [];
	readonly #_completionPromiseSource: PromiseCompletionSource<void> = new PromiseCompletionSource();
	#_complete: boolean = false;

	public constructor()
	{
		SealedClassError.throwIfNotEqual(UnboundedChannelCore, new.target);
	}

	public complete()
	{
		if (this.#_complete)
		{
			throw new InvalidOperationError("Channel has already been marked as completed");
		}
		
		this.#_completionPromiseSource.resolve();

		for (const reader of this.#_readersWaiting)
		{
			reader.resolve(false);
		}

		this.#_complete = true;
	}

	public get completion()
	{
		return this.#_completionPromiseSource.promise;
	}

	public get count()
	{
		return this.#_items.length;
	}

	public waitToWrite()
	{
		return Promise.resolve(!this.#_complete);
	}

	public async write(item: T)
	{
		if (this.#_complete)
		{
			throw new InvalidOperationError("Channel has already been marked as completed");
		}

		this.#_items.push(item);
		this.#_readersWaiting.shift()?.resolve(true);
	}

	public async waitToRead()
	{
		if (this.#_items.length > 0)
		{
			return true;
		}

		if (this.#_complete)
		{
			throw new InvalidOperationError("The Channel is complete and no more items remain");
		}

		const promiseSource = new PromiseCompletionSource<boolean>();
		this.#_readersWaiting.push(promiseSource);

		return await promiseSource.promise;
	}

	public read()
	{
		if (this.#_items.length > 0)
		{
			return Promise.resolve(this.#_items.shift()!);
		}

		if (this.#_complete)
		{
			throw new InvalidOperationError("The Channel is complete and no more items remain");
		}

		throw new InvalidOperationError("There are no available items to read");
	}
}

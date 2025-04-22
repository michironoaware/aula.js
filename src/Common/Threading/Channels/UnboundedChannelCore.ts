﻿import { SealedClassError } from "../../SealedClassError";
import { InvalidOperationError } from "../../InvalidOperationError";
import { PromiseCompletionSource } from "../PromiseCompletionSource";
import { ThrowHelper } from "../../ThrowHelper";
import { ReadAttemptResult } from "./ReadAttemptResult";

/**
 * @sealed
 * */
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

	public get completion()
	{
		return this.#_completionPromiseSource.promise;
	}

	public get count()
	{
		return this.#_items.length;
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

	public waitToWrite()
	{
		return Promise.resolve(!this.#_complete);
	}

	public write(item: Exclude<T, undefined>)
	{
		ThrowHelper.TypeError.throwIfUndefined(item);

		if (this.#_complete)
		{
			throw new InvalidOperationError("Channel has already been marked as completed");
		}

		this.#_items.push(item);
		while (this.#_readersWaiting.length > 0)
		{
			this.#_readersWaiting.shift()!.resolve(true);
		}

		return Promise.resolve();
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
			return Promise.resolve(this.#_items.shift() as Exclude<T, undefined>);
		}

		if (this.#_complete)
		{
			throw new InvalidOperationError("The Channel is complete and no more items remain");
		}

		throw new InvalidOperationError("There are no available items to read");
	}

	public tryRead()
	{
		if (this.#_items.length > 0)
		{
			return new ReadAttemptResult(true, this.#_items.shift() as Exclude<T, undefined>);
		}

		return ReadAttemptResult.failed<T>();
	}
}

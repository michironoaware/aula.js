import { SealedClassError } from "../SealedClassError.js";
import { Func } from "../Func.js";

export class PromiseCompletionSource<TResolve>
{
	readonly #_promise: Promise<TResolve>;
	#_resolve: Func<[ TResolve ]> = null!;
	#_reject: Func<[ any? ]> = null!;
	readonly #_resolved: boolean = false;
	readonly #_rejected: boolean = false;

	public constructor()
	{
		SealedClassError.throwIfNotEqual(PromiseCompletionSource, new.target);

		this.#_promise = new Promise<TResolve>((resolve, reject) =>
		{
			this.#_resolve = resolve;
			this.#_reject = reject;
		});
	}

	public get promise()
	{
		return this.#_promise;
	}

	public get resolve()
	{
		return this.#_resolve;
	}

	public get reject()
	{
		return this.#_reject;
	}

	public get isComplete()
	{
		return this.#_resolved || this.#_rejected;
	}

	public get isRejected()
	{
		return this.#_rejected;
	}

	public get isCompleteSuccessfully()
	{
		return this.#_resolved;
	}
}

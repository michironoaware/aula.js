import { Action } from "../Action.js";
import { SealedClassError } from "../SealedClassError.js";

export class PromiseCompletionSource<TResolve>
{
	readonly #_promise: Promise<TResolve>;
	#_resolve: Action<[ TResolve ]> = null!;
	#_reject: Action<[ any? ]> = null!;

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
}

import { SealedClassError } from "../../SealedClassError.js";
import { ThrowHelper } from "../../ThrowHelper.js";

export class ReadAttemptResult<TItem>
{
	readonly #_succeeded: boolean;
	readonly #_item: TItem;

	public constructor(succeeded: boolean, item: TItem)
	{
		SealedClassError.throwIfNotEqual(ReadAttemptResult, new.target);
		ThrowHelper.TypeError.throwIfNotType(succeeded, "boolean");

		this.#_succeeded = succeeded;
		this.#_item = item;
	}

	public get succeeded()
	{
		return this.#_succeeded;
	}

	public get item()
	{
		return this.#_item;
	}
}

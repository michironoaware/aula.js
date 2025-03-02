import {ThrowHelper} from "../Common/ThrowHelper.js";

export class AulaError extends Error
{
	readonly #content: string | null;

	public constructor(
		message: string | undefined = undefined,
		content: string | null)
	{
		super(message);
		ThrowHelper.TypeError.throwIfNotAnyType(message, "string", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(content, "string", "null");

		this.#content = content;
	}

	public get content()
	{
		return this.#content;
	}
}

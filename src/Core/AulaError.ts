export default class AulaError extends Error
{
	readonly #content: string | null;

	constructor(
		message: string | undefined = undefined,
		content: string | null)
	{
		super(message);
		this.#content = content;
	}

	get content()
	{
		return this.#content;
	}
}
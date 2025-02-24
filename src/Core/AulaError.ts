export default class AulaError extends Error
{
	readonly #content: string | null;

	public constructor(
		message: string | undefined = undefined,
		content: string | null)
	{
		super(message);
		this.#content = content;
	}

	public get content()
	{
		return this.#content;
	}
}

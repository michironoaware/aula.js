export class AulaRoute
{
	static readonly #currentUser = "users/@me";

	static get CurrentUser()
	{
		return this.#currentUser;
	}
}

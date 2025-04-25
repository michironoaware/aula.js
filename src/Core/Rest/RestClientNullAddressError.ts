import { InvalidOperationError } from "../../Common/InvalidOperationError";
import { SealedClassError } from "../../Common/SealedClassError";
import { RestClient } from "./RestClient";

/**
 * Thrown when a {@link RestClient} method that does REST-related operations is called without the server address being defined first.
 * */
export class RestClientNullAddressError extends InvalidOperationError
{
	readonly #_restClient: RestClient;

	/**
	 * Initializes a new instance of {@link RestClientNullAddressError}.
	 * */
	constructor(restClient: RestClient)
	{
		super("No server address for the client has been defined.");
		SealedClassError.throwIfNotEqual(RestClientNullAddressError, new.target);
		//ThrowHelper.TypeError.throwIfNotType(restClient, RestClient); // Circular dependency problem

		this.#_restClient = restClient;
	}
}

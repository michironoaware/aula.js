import { RestClient } from "../RestClient";
import { BanData } from "./Models/BanData";
import { ThrowHelper } from "../../../Common/ThrowHelper";
import { CancellationToken } from "../../../Common/Threading/CancellationToken";

/**
 * Represents a ban within Aula.
 * */
export class Ban
{
	readonly #_restClient: RestClient;
	readonly #_data: BanData;
	#_emissionDate: Date | null = null;

	/**
	 * Initializes a new instance of {@link Ban}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: BanData, restClient: RestClient)
	{
		ThrowHelper.TypeError.throwIfNotType(data, BanData);
		//ThrowHelper.TypeError.throwIfNotType(restClient, RestClient); // Circular dependency problem

		this.#_restClient = restClient;
		this.#_data = data;
	}

	/**
	 * Gets the {@link RestClient} that initialized this instance.
	 * */
	get restClient()
	{
		return this.#_restClient;
	}

	/**
	 * Gets the ID of the ban.
	 * */
	get id()
	{
		return this.#_data.id;
	}

	/**
	 * Gets the type of ban.
	 * */
	get type()
	{
		return this.#_data.type;
	}

	/**
	 * Gets the type of the issuer of the ban.
	 * */
	get issuerType()
	{
		return this.#_data.issuerType;
	}

	/**
	 * Gets the ID of the user who issued the ban.
	 * */
	public get issuerId()
	{
		return this.#_data.issuerId;
	}

	/**
	 * Gets the reason for the ban.
	 * */
	get reason()
	{
		return this.#_data.reason;
	}

	/**
	 * Gets whether the ban is still in effect.
	 * */
	get isLifted()
	{
		return this.#_data.isLifted;
	}

	/**
	 * Gets the emission date of the ban as a {@link Date} object.
	 * */
	get emissionDate()
	{
		return this.#_emissionDate ??= new Date(this.#_data.emissionDate);
	}

	/**
	 * Gets the user who created the ban.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a new {@link User} instance, or `null` if the issuer is not a user.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * */
	public async getIssuer(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return this.issuerId !== null ? await this.restClient.getUser(this.issuerId, cancellationToken) : null;
	}
}

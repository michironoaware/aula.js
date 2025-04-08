import { RestClient } from "../RestClient.js";
import { BanData } from "./Models/BanData.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";

/**
 * Represents a ban within Aula.
 * */
export class Ban
{
	readonly #_restClient: RestClient;
	readonly #_data: BanData;
	#_creationDate: Date | null = null;

	/**
	 * Initializes a new instance of {@link Ban}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: BanData, restClient: RestClient)
	{
		ThrowHelper.TypeError.throwIfNotType(data, BanData);
		ThrowHelper.TypeError.throwIfNotType(restClient, RestClient);

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
	 * Gets the type of ban.
	 * */
	get type()
	{
		return this.#_data.type;
	}

	/**
	 * Gets the id of the user who created the ban.
	 * */
	get executorId()
	{
		return this.#_data.executorId;
	}

	/**
	 * Gets the reason for the ban.
	 * */
	get reason()
	{
		return this.#_data.reason;
	}

	/**
	 * Gets the emission date of the ban as a {@link Date} object.
	 * */
	get creationDate()
	{
		return this.#_creationDate ??= new Date(this.#_data.creationDate);
	}

	/**
	 * Gets the user who created the ban.
	 * @returns A promise that resolves to a new {@link User} instance, or `null` if the executor is not a user.
	 * */
	public async getExecutor()
	{
		return this.executorId !== null ? await this.restClient.getUser(this.executorId) : null;
	}
}

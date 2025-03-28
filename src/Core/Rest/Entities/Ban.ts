import { RestClient } from "../RestClient.js";
import { BanData } from "./Models/BanData.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { BanType } from "./BanType.js";
import { InvalidOperationError } from "../../../Common/InvalidOperationError.js";

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
	 * */
	public constructor(data: BanData, restClient: RestClient)
	{
		SealedClassError.throwIfNotEqual(Ban, new.target);
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
	 * Gets the type of ban
	 * */
	get type()
	{
		return this.#_data.type;
	}

	/**
	 * Gets the ID of the user that created the ban.
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
	 * Gets the ID of the banned user.
	 * */
	get targetId()
	{
		return this.#_data.targetId;
	}

	/**
	 * Gets the emission date of the ban as a {@link Date} object.
	 * */
	get creationDate()
	{
		return this.#_creationDate ??= new Date(this.#_data.creationDate);
	}

	/**
	 * Gets the latest version of this entity, or null if it no longer exists.
	 * */
	public async getLatest()
	{
		switch (this.type)
		{
			case BanType.Id:
				return await this.restClient.getUserBan(this.targetId!);
			default:
				throw new InvalidOperationError("Unexpected ban type");
		}
	}

	/**
	 * Gets the user that created the ban, or null if it no longer exists or the creator was not a user.
	 * */
	public async getExecutor()
	{
		if (this.executorId === null)
		{
			return null;
		}

		return await this.restClient.getUser(this.executorId);
	}

	/**
	 * Gets the banned user, or null if the ban does not target a specific user.
	 * */
	public async getTarget()
	{
		if (this.targetId === null)
		{
			return null;
		}

		return await this.restClient.getUser(this.targetId);
	}
}

import { Ban } from "./Ban.js";
import { BanData } from "./Models/BanData.js";
import { RestClient } from "../RestClient.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";
import { InvalidOperationError } from "../../../Common/InvalidOperationError.js";
import { BanType } from "./BanType.js";

/**
 * Represents a user ban within Aula.
 * @sealed
 * */
export class UserBan extends Ban
{
	readonly #_data: BanData;

	/**
	 * Initializes a new instance of {@link UserBan}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: BanData, restClient: RestClient)
	{
		super(data, restClient);
		SealedClassError.throwIfNotEqual(UserBan, new.target);
		
		if (data.type !== BanType.Id)
		{
			throw new InvalidOperationError("Unexpected ban type.");
		}

		this.#_data = data;
	}

	/**
	 * Gets the ID of the banned user.
	 * */
	get targetId()
	{
		return this.#_data.targetId!;
	}

	/**
	 * Gets the latest version of this entity, or null if it no longer exists.
	 * */
	public async getLatest()
	{
		return await this.restClient.getUserBan(this.targetId) as UserBan | null;
	}

	/**
	 * Gets the banned user.
	 * */
	public async getTarget()
	{
		return await this.restClient.getUser(this.targetId);
	}
}

import { Ban } from "./Ban";
import { BanData } from "./Models/BanData";
import { RestClient } from "../RestClient";
import { SealedClassError } from "../../../Common/SealedClassError";
import { InvalidOperationError } from "../../../Common/InvalidOperationError";
import { BanType } from "./BanType";
import { CancellationToken } from "../../../Common/Threading/CancellationToken";

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
	 * Gets the banned user.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * */
	public async getTarget(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return await this.restClient.getUser(this.targetId, cancellationToken);
	}
}

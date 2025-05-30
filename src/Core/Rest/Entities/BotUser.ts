import { User } from "./User";
import { UserData } from "./Models/UserData";
import { RestClient } from "../RestClient";
import { SealedClassError } from "../../../Common/SealedClassError";
import { InvalidOperationError } from "../../../Common/InvalidOperationError";
import { UserType } from "./UserType";
import { CancellationToken } from "../../../Common/Threading/CancellationToken";

/**
 * Represents a bot user within Aula.
 * @sealed
 * */
export class BotUser extends User
{
	/**
	 * Initializes a new instance of {@link BotUser}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: UserData, restClient: RestClient)
	{
		super(data, restClient);
		SealedClassError.throwIfNotEqual(BotUser, new.target);

		if (data.type !== UserType.Bot)
		{
			throw new InvalidOperationError(`User type expected to be ${UserType.Bot}.`);
		}
	}

	/**
	 * Deletes the bot user.
	 * Requires the {@link Permissions.Administrator} permission.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * */
	public async delete(cancellationToken: CancellationToken = CancellationToken.none)
	{
		await this.restClient.deleteBot(this.id, cancellationToken);
	}
}

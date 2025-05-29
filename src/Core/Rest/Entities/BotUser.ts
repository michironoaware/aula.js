import { User } from "./User";
import { UserData } from "./Models/UserData";
import { RestClient } from "../RestClient";
import { SealedClassError } from "../../../Common/SealedClassError";
import { InvalidOperationError } from "../../../Common/InvalidOperationError";
import { UserType } from "./UserType";

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
}

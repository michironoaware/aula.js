import { User } from "./User";
import { UserData } from "./Models/UserData";
import { RestClient } from "../RestClient";
import { SealedClassError } from "../../../Common/SealedClassError";
import { InvalidOperationError } from "../../../Common/InvalidOperationError";
import { UserType } from "./UserType";

/**
 * Represents a standard user within Aula.
 * @sealed
 * */
export class StandardUser extends User
{
	/**
	 * Initializes a new instance of {@link StandardUser}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: UserData, restClient: RestClient)
	{
		super(data, restClient);
		SealedClassError.throwIfNotEqual(StandardUser, new.target);

		if (data.type !== UserType.Standard)
		{
			throw new InvalidOperationError(`User type expected to be ${UserType.Standard}.`);
		}
	}
}

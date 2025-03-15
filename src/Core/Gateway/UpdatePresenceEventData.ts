import { PresenceOption } from "./PresenceOption.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { SealedClassError } from "../../Common/SealedClassError.js";

export class UpdatePresenceEventData
{
	readonly #_presence: PresenceOption;

	public constructor(presence: PresenceOption)
	{
		SealedClassError.throwIfNotEqual(UpdatePresenceEventData, new.target);
		ThrowHelper.TypeError.throwIfNotType(presence, PresenceOption);

		this.#_presence = presence;
	}

	public get presence()
	{
		return this.#_presence;
	}
}

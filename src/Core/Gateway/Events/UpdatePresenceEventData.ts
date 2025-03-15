import { PresenceOptions } from "./PresenceOptions.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { SealedClassError } from "../../../Common/SealedClassError.js";

export class UpdatePresenceEventData
{
	readonly #_presence: PresenceOptions;

	public constructor(presence: PresenceOptions)
	{
		SealedClassError.throwIfNotEqual(UpdatePresenceEventData, new.target);
		ThrowHelper.TypeError.throwIfNotType(presence, PresenceOptions);

		this.#_presence = presence;
	}

	public get presence()
	{
		return this.#_presence;
	}
}

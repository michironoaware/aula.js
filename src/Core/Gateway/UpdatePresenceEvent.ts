import { PresenceOption } from "./PresenceOption.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { SealedClassError } from "../../Common/SealedClassError.js";

export class UpdatePresenceEvent
{
	readonly #_presence: PresenceOption;

	public constructor(presence: PresenceOption)
	{
		SealedClassError.throwIfNotEqual(UpdatePresenceEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(presence, PresenceOption);

		this.#_presence = presence;
	}

	public get presence()
	{
		return this.#_presence;
	}
}

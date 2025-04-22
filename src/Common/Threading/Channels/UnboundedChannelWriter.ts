import { ChannelWriter } from "./ChannelWriter";
import { SealedClassError } from "../../SealedClassError";
import { UnboundedChannelCore } from "./UnboundedChannelCore";
import { ThrowHelper } from "../../ThrowHelper";

/**
 * @sealed
 * */
export class UnboundedChannelWriter<T> extends ChannelWriter<T>
{
	readonly #_core: UnboundedChannelCore<T>;

	public constructor(core: UnboundedChannelCore<T>)
	{
		super();
		SealedClassError.throwIfNotEqual(UnboundedChannelWriter, new.target);
		ThrowHelper.TypeError.throwIfNotType(core, UnboundedChannelCore);

		this.#_core = core;
	}

	public complete()
	{
		return this.#_core.complete();
	}

	public async waitToWrite()
	{
		return await this.#_core.waitToWrite();
	}

	public async write(item: Exclude<T, undefined>)
	{
		return await this.#_core.write(item);
	}
}

import { ChannelReader } from "./ChannelReader";
import { SealedClassError } from "../../SealedClassError";
import { UnboundedChannelCore } from "./UnboundedChannelCore";
import { ThrowHelper } from "../../ThrowHelper";

/**
 * @sealed
 * */
export class UnboundedChannelReader<T> extends ChannelReader<T>
{
	readonly #_core: UnboundedChannelCore<T>;

	public constructor(core: UnboundedChannelCore<T>)
	{
		super();
		SealedClassError.throwIfNotEqual(UnboundedChannelReader, new.target);
		ThrowHelper.TypeError.throwIfNotType(core, UnboundedChannelCore);

		this.#_core = core;
	}

	public get completion()
	{
		return this.#_core.completion;
	}

	public get count()
	{
		return this.#_core.count;
	}

	public async waitToRead()
	{
		return await this.#_core.waitToRead();
	}

	public async read()
	{
		return await this.#_core.read();
	}

	public tryRead()
	{
		return this.#_core.tryRead();
	}
}

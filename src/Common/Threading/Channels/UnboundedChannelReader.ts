import { ChannelReader } from "./ChannelReader.js";
import { SealedClassError } from "../../SealedClassError.js";
import { UnboundedChannelCore } from "./UnboundedChannelCore.js";
import { ThrowHelper } from "../../ThrowHelper.js";

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

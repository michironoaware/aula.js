import { Channel } from "./Channel";
import { SealedClassError } from "../../SealedClassError";
import { UnboundedChannelCore } from "./UnboundedChannelCore";
import { UnboundedChannelReader } from "./UnboundedChannelReader";
import { UnboundedChannelWriter } from "./UnboundedChannelWriter";

/**
 * @sealed
 * */
export class UnboundedChannel<T> extends Channel<T>
{
	readonly #_writer: UnboundedChannelWriter<T>;
	readonly #_reader: UnboundedChannelReader<T>;

	public constructor()
	{
		super();
		SealedClassError.throwIfNotEqual(UnboundedChannel, new.target);

		const core = new UnboundedChannelCore<T>();
		this.#_writer = new UnboundedChannelWriter(core);
		this.#_reader = new UnboundedChannelReader(core);
	}

	public get writer()
	{
		return this.#_writer;
	}

	public get reader()
	{
		return this.#_reader;
	}
}

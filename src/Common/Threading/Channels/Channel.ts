import { ChannelWriter } from "./ChannelWriter.js";
import { ChannelReader } from "./ChannelReader.js";

export abstract class Channel<TWrite, TRead = TWrite>
{
	public abstract writer: ChannelWriter<TWrite>;

	public abstract reader: ChannelReader<TRead>;
}

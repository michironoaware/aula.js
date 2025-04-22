import { ChannelWriter } from "./ChannelWriter";
import { ChannelReader } from "./ChannelReader";

export abstract class Channel<TWrite, TRead = TWrite>
{
	public abstract writer: ChannelWriter<TWrite>;

	public abstract reader: ChannelReader<TRead>;
}

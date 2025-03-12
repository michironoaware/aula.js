export abstract class ChannelWriter<T>
{
	public abstract waitToWrite(): Promise<void>;

	public abstract write(): Promise<void>;
}

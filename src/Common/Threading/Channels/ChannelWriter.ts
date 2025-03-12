export abstract class ChannelWriter<T>
{
	public abstract waitToWrite(): Promise<boolean>;

	public abstract write(): Promise<void>;
}

export abstract class ChannelWriter<T>
{
	public abstract waitToWrite(): Promise<boolean>;

	public abstract write(item: T): Promise<void>;
}

export abstract class ChannelReader<T>
{
	public abstract waitToRead(): Promise<void>;

	public abstract read(): Promise<T>;
}

export abstract class ChannelReader<T>
{
	public abstract waitToRead(): Promise<boolean>;

	public abstract read(): Promise<T>;
}

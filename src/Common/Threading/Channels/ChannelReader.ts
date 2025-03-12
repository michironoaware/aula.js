export abstract class ChannelReader<T>
{
	public abstract completion: Promise<void>;

	public abstract waitToRead(): Promise<boolean>;

	public abstract read(): Promise<T>;
}

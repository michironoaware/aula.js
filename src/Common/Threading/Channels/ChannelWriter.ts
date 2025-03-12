export abstract class ChannelWriter<T>
{
	public abstract complete(): void;

	public abstract waitToWrite(): Promise<boolean>;

	public abstract write(item: T): Promise<void>;
}

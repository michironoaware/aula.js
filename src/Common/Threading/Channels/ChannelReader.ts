import { ReadAttemptResult } from "./ReadAttemptResult.js";

export abstract class ChannelReader<T>
{
	public abstract completion: Promise<void>;

	public abstract count: number;

	public abstract waitToRead(): Promise<boolean>;

	public abstract read(): Promise<T>;

	public abstract tryRead(): ReadAttemptResult<T>;
}

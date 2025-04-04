import { CancellationTokenSource, ICancellationTokenSourceEvents } from "./CancellationTokenSource.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { OperationCanceledError } from "./OperationCanceledError.js";

export class CancellationToken
{
	readonly #_source: CancellationTokenSource;

	public constructor(source: CancellationTokenSource)
	{
		ThrowHelper.TypeError.throwIfNotType(source, CancellationTokenSource);

		this.#_source = source;
	}

	public static get none()
	{
		return NeverCancelledToken.instance;
	}

	public get isCancellationRequested()
	{
		return this.#_source.isCancellationRequested;
	}

	public throwIfCancellationRequested()
	{
		if (this.#_source.isCancellationRequested)
		{
			throw new OperationCanceledError();
		}
	}

	public on<TEvent extends keyof ICancellationTokenEvents>(
		event: TEvent,
		listener: ICancellationTokenEvents[TEvent])
	{
		return this.#_source.on(event, listener);
	}
}

/**
 * Special {@link CancellationToken} that never attaches {@link ICancellationTokenEvents.Cancelled}
 * events to avoid memory issues caused by attaching listeners
 * to a token that never emits events and is never garbage collected.
 * @package
 * */
class NeverCancelledToken extends CancellationToken
{
	static readonly #s_instance: CancellationToken = new NeverCancelledToken(new CancellationTokenSource());

	public static get instance()
	{
		return this.#s_instance;
	}

	public on<TEvent extends keyof ICancellationTokenEvents>(
		event: TEvent,
		listener: ICancellationTokenEvents[TEvent])
	{
		if (event === "Cancelled")
		{
			return;
		}

		super.on(event, listener);
	}
}

export interface ICancellationTokenEvents extends ICancellationTokenSourceEvents
{
}

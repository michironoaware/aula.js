import { CancellationTokenSource, ICancellationTokenSourceEvents } from "./CancellationTokenSource.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { OperationCanceledError } from "./OperationCanceledError.js";

/**
 * Propagates notification that operations should be canceled.
 * */
export class CancellationToken
{
	readonly #_source: CancellationTokenSource;

	/**
	 * Initializes a new instance of {@link CancellationToken}.
	 * @param source The cancellation token source of the token.
	 * */
	public constructor(source: CancellationTokenSource)
	{
		ThrowHelper.TypeError.throwIfNotType(source, CancellationTokenSource);

		this.#_source = source;
	}

	/**
	 * Gets a cancellation token that is never canceled.
	 * */
	public static get none()
	{
		return NeverCancelledToken.instance;
	}

	/**
	 * Gets whether cancellation has been requested for this token.
	 * */
	public get isCancellationRequested()
	{
		return this.#_source.isCancellationRequested;
	}

	/**
	 * Throws a {@link OperationCanceledError} if this token has had cancellation requested.
	 * */
	public throwIfCancellationRequested()
	{
		if (this.#_source.isCancellationRequested)
		{
			throw new OperationCanceledError();
		}
	}

	public onCancelled(listener: ICancellationTokenEvents["Cancelled"])
	{
		return this.#_source.onCancelled(listener);
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

	public onCancelled(listener: ICancellationTokenEvents["Cancelled"])
	{
		return;
	}
}

export interface ICancellationTokenEvents extends ICancellationTokenSourceEvents
{
}

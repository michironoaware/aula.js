import { SealedClassError } from "../SealedClassError.js";
import { CancellationToken } from "./CancellationToken.js";
import { EventEmitter } from "./EventEmitter.js";
import { Func } from "../Func.js";
import { ThrowHelper } from "../ThrowHelper.js";

/**
 * Signals to a {@link CancellationToken} that it should be canceled.
 * @sealed
 * */
export class CancellationTokenSource
{
	#_cancellationRequested: boolean = false;
	#_token: CancellationToken | null = null;
	#_eventEmitter: EventEmitter<ICancellationTokenSourceEvents> | null = null;

	/**
	 * Initializes a new instance of {@link CancellationTokenSource}.
	 * */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(CancellationTokenSource, new.target);
	}

	/**
	 * Gets whether cancellation has been requested for this {@link CancellationTokenSource}.
	 * */
	public get isCancellationRequested()
	{
		return this.#_cancellationRequested;
	}

	/**
	 * Gets the {@link CancellationToken} associated with this {@link CancellationTokenSource}.
	 * */
	public get token()
	{
		return this.#_token ??= new CancellationToken(this);
	}

	/**
	 * Communicates a request for cancellation.
	 * */
	public cancel()
	{
		if (this.#_cancellationRequested)
		{
			return;
		}

		this.#_cancellationRequested = true;
		this.#_eventEmitter?.emit("Cancelled");
	}

	/**
	 * Attaches a listener to be executed on cancellation.
	 * @param listener The callback function to call when cancellation is requested.
	 * */
	public onCancelled(listener: ICancellationTokenSourceEvents["Cancelled"])
	{
		ThrowHelper.TypeError.throwIfNotType(listener, "function");

		// If operation is already cancelled call listener immediately.
		if (this.#_cancellationRequested)
		{
			listener();
			return;
		}

		(this.#_eventEmitter ??= new EventEmitter()).on("Cancelled", listener);
	}
}

export interface ICancellationTokenSourceEvents
{
	Cancelled: Func<[]>;
}

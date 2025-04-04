import { SealedClassError } from "../SealedClassError.js";
import { CancellationToken } from "./CancellationToken.js";
import { EventEmitter } from "./EventEmitter.js";
import { Func } from "../Func.js";
import { ThrowHelper } from "../ThrowHelper.js";

export class CancellationTokenSource
{
	#_cancellationRequested: boolean = false;
	#_token: CancellationToken | null = null;
	#_eventEmitter: EventEmitter<ICancellationTokenSourceEvents> | null = null;

	public constructor()
	{
		SealedClassError.throwIfNotEqual(CancellationTokenSource, new.target);
	}

	public get isCancellationRequested()
	{
		return this.#_cancellationRequested;
	}

	public get token()
	{
		return this.#_token ??= new CancellationToken(this);
	}

	public cancel()
	{
		if (this.#_cancellationRequested)
		{
			return;
		}

		this.#_cancellationRequested = true;
		this.#_eventEmitter?.emit("Cancelled");
	}

	public on<TEvent extends keyof ICancellationTokenSourceEvents>(
		event: TEvent,
		listener: ICancellationTokenSourceEvents[TEvent])
	{
		ThrowHelper.TypeError.throwIfNullable(event);
		ThrowHelper.TypeError.throwIfNotType(listener, "function");

		// If operation is already cancelled call listener immediately.
		if (this.#_cancellationRequested &&
		    event === "Cancelled")
		{
			listener();
			return;
		}

		(this.#_eventEmitter ??= new EventEmitter()).on(event, listener);
	}
}

export interface ICancellationTokenSourceEvents
{
	Cancelled: Func<[]>;
}

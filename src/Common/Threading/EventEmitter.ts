import { SealedClassError } from "../SealedClassError";
import { Semaphore } from "./Semaphore";
import { ThrowHelper } from "../ThrowHelper";
import { IDisposable } from "../IDisposable";
import { ObjectDisposedError } from "../ObjectDisposedError";
import { AsNonBlocking } from "./AsNonBlocking";
import { Func } from "../Func";
import { TypeHelper } from "../TypeHelper";

/**
 * @sealed
 * */
export class EventEmitter<TEventMap extends Record<keyof TEventMap, Func<[ ...any[] ]>>> implements IDisposable
{
	readonly #_listeners: Map<keyof TEventMap, TEventMap[keyof TEventMap][]> = new Map();
	readonly #_operateOverListenersSemaphore: Semaphore = new Semaphore(1, 1);
	#_disposed: boolean = false;

	public constructor()
	{
		SealedClassError.throwIfNotEqual(EventEmitter, new.target);
	}

	public on<TEvent extends keyof TEventMap>(event: TEvent, listener: TEventMap[TEvent])
	{
		ThrowHelper.TypeError.throwIfNullable(event);
		ThrowHelper.TypeError.throwIfNotType(listener, "function");
		ObjectDisposedError.throwIf(this.#_disposed);

		let listeners = this.#_listeners.get(event);
		if (listeners === undefined)
		{
			listeners = [];
			this.#_listeners.set(event, listeners);
		}

		listeners.push(listener);
	}

	public remove<TEvent extends keyof TEventMap>(event: TEvent, listener: TEventMap[TEvent])
	{
		ThrowHelper.TypeError.throwIfNullable(event);
		ThrowHelper.TypeError.throwIfNotType(listener, "function");
		ObjectDisposedError.throwIf(this.#_disposed);

		const listeners = this.#_listeners.get(event);
		if (listeners === undefined)
		{
			return;
		}

		const listenerIndex = listeners.indexOf(listener);
		if (listenerIndex === -1)
		{
			return;
		}

		listeners.splice(listenerIndex, 1);
	}

	public async emit<TEvent extends keyof TEventMap>(event: TEvent, ...args: Parameters<TEventMap[TEvent]>)
	{
		ThrowHelper.TypeError.throwIfNullable(event);
		ThrowHelper.TypeError.throwIfNotType(args, "iterable");
		ObjectDisposedError.throwIf(this.#_disposed);

		const listeners = this.#_listeners.get(event);
		if (listeners === undefined)
		{
			return;
		}

		const promises = listeners.map(l => AsNonBlocking(() => l(...args)));
		await Promise.all(promises);

		return;
	}

	public removeAll<TEvent extends keyof TEventMap>(event?: TEvent)
	{
		ObjectDisposedError.throwIf(this.#_disposed);

		if (TypeHelper.isNullable(event))
		{
			this.#_listeners.clear();
			return;
		}

		const listeners = this.#_listeners.get(event);
		if (listeners === undefined ||
		    listeners.length === 0)
		{
			return;
		}

		listeners.length = 0;
	}

	public [Symbol.dispose]()
	{
		if (this.#_disposed)
		{
			return;
		}

		this.#_operateOverListenersSemaphore[Symbol.dispose]();
		this.#_listeners.clear();
		this.#_disposed = true;
	}
}

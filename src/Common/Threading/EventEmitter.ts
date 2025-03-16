import { SealedClassError } from "../SealedClassError.js";
import { Semaphore } from "./Semaphore.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { IDisposable } from "../IDisposable.js";
import { ObjectDisposedError } from "../ObjectDisposedError.js";
import { AsNonBlocking } from "./AsNonBlocking.js";
import { Func } from "../Func.js";

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

	public dispose()
	{
		if (this.#_disposed)
		{
			return;
		}

		this.#_operateOverListenersSemaphore.dispose();
		this.#_listeners.clear();
		this.#_disposed = true;
	}
}

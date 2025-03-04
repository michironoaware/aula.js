import { SealedClassError } from "../SealedClassError.js";
import { Semaphore } from "./Semaphore.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { Action } from "../Action.js";
import { IDisposable } from "../IDisposable.js";
import { ObjectDisposedError } from "../ObjectDisposedError.js";
import { AsNonBlocking } from "./AsNonBlocking.js";

export class EventEmitter<TEventMap extends Record<keyof TEventMap, Action<[ ...any[] ]>>> implements IDisposable
{
	readonly #listeners: Map<keyof TEventMap, TEventMap[keyof TEventMap][]> = new Map();
	readonly #operateOverListenersSemaphore: Semaphore = new Semaphore(1, 1);
	#disposed: boolean = false;

	public constructor()
	{
		SealedClassError.throwIfNotEqual(EventEmitter, new.target);
	}

	public async on<TEvent extends keyof TEventMap>(event: TEvent, listener: TEventMap[TEvent])
	{
		ObjectDisposedError.throwIf(this.#disposed);
		ThrowHelper.TypeError.throwIfNullable(event);
		ThrowHelper.TypeError.throwIfNotType(listener, "function");

		await this.#operateOverListenersSemaphore.waitOne();

		let listeners = this.#listeners.get(event);
		if (listeners === undefined)
		{
			listeners = [];
			this.#listeners.set(event, listeners);
		}

		listeners.push(listener);

		this.#operateOverListenersSemaphore.release();
	}

	public async remove<TEvent extends keyof TEventMap>(event: TEvent, listener: TEventMap[TEvent])
	{
		ObjectDisposedError.throwIf(this.#disposed);
		ThrowHelper.TypeError.throwIfNullable(event);
		ThrowHelper.TypeError.throwIfNotType(listener, "function");

		await this.#operateOverListenersSemaphore.waitOne();

		const listeners = this.#listeners.get(event);
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

		this.#operateOverListenersSemaphore.release();
	}

	public async emit<TEvent extends keyof TEventMap>(event: TEvent, ...args: Parameters<TEventMap[TEvent]>)
	{
		ObjectDisposedError.throwIf(this.#disposed);
		ThrowHelper.TypeError.throwIfNullable(event);
		ThrowHelper.TypeError.throwIfNotType(args, "iterable");

		const listeners = this.#listeners.get(event);
		if (listeners === undefined)
		{
			return;
		}

		const promises = listeners.map(l => AsNonBlocking(() => l(args)));
		return await Promise.all(promises);
	}

	public dispose()
	{
		if (this.#disposed)
		{
			return;
		}

		this.#operateOverListenersSemaphore.dispose();
		this.#listeners.clear();
		this.#disposed = true;
	}
}

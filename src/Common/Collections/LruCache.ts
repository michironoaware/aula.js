import { LinkedListNode } from "./LinkedListNode";
import { LinkedList } from "./LinkedList";
import { ThrowHelper } from "../ThrowHelper";
import { ValueOutOfRangeError } from "../ValueOutOfRangeError";
import { UnreachableError } from "../UnreachableError";
import { SealedClassError } from "../SealedClassError";

/**
 * @sealed
 * */
export class LruCache<TKey extends {}, TValue extends {} | null> implements Map<TKey, TValue>
{
	readonly #_order = new LinkedList<TKey>();
	readonly #_entries = new Map<TKey, LruCacheEntry<TKey, TValue>>();
	#_size: number;
	#_ignoreNewEntries: boolean;

	public constructor(size: number, ignoreNewEntries: boolean = false)
	{
		SealedClassError.throwIfNotEqual(LruCache, new.target);
		ThrowHelper.TypeError.throwIfNotType(size, "number");
		ThrowHelper.TypeError.throwIfNotType(ignoreNewEntries, "boolean");

		this.#_size = size;
		this.#_ignoreNewEntries = ignoreNewEntries;
	}

	public get size()
	{
		return this.#_size;
	}

	public get ignoreNewEntries()
	{
		return this.#_ignoreNewEntries;
	}

	public set ignoreNewEntries(value: boolean)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "boolean");
		this.#_ignoreNewEntries = value;
	}

	public get [Symbol.toStringTag](): string
	{
		return "LruCache";
	}

	public expandSize(extraCapacity: number)
	{
		ThrowHelper.TypeError.throwIfNotType(extraCapacity, "number");
		ValueOutOfRangeError.throwIfLessThan(extraCapacity, 0);
		this.#_size += extraCapacity;
	}

	public get(key: TKey)
	{
		ThrowHelper.TypeError.throwIfNullable(key);

		const entry = this.#_entries.get(key);
		if (entry === undefined)
		{
			return;
		}

		if (entry.node !== this.#_order.first)
		{
			this.#_order.remove(entry.node);
			this.#_order.addFirst(entry.node);
		}

		return entry.value;
	}

	public has(key: TKey)
	{
		return this.#_entries.has(key);
	}

	public clear()
	{
		this.#_entries.clear();
		this.#_order.clear();
	}

	public remove(key: TKey)
	{
		const removedFromEntries = this.#_entries.delete(key);
		const removedFromOrder = this.#_order.remove(key);

		if (removedFromEntries !== removedFromOrder)
		{
			throw new UnreachableError("Key expected to be in both entries and entry order list");
		}

		return removedFromEntries;
	}

	public removeLru()
	{
		const last = this.#_order.last;
		if (last === null)
		{
			return false;
		}

		return this.remove(last.value);
	}

	public getAndRemove(key: TKey)
	{
		const entry = this.#_entries.get(key);
		if (entry === undefined)
		{
			return;
		}

		this.remove(key);
		return entry.value;
	}

	public getAndRemoveLru()
	{
		const last = this.#_order.last;
		if (last === null)
		{
			return;
		}

		const entry = this.#_entries.get(last.value)!;
		this.remove(last.value);
		return entry.value;
	}

	public addOrReplace(key: TKey, value: TValue)
	{
		if (this.#_ignoreNewEntries)
		{
			return;
		}

		const entry = this.#_entries.get(key);
		if (entry !== undefined)
		{
			entry.value = value;
			this.#_order.remove(entry.node);
			this.#_order.addFirst(entry.node);
			return;
		}

		if (this.#_entries.size >= this.#_size)
		{
			const lastNode = this.#_order.last!;
			this.#_entries.delete(lastNode.value);
			this.#_order.remove(lastNode);
		}

		const newNode = this.#_order.addFirst(key);
		this.#_entries.set(key, new LruCacheEntry(value, newNode));
	}

	public delete(key: TKey)
	{
		return this.remove(key);
	}

	public set(key: TKey, value: TValue)
	{
		this.addOrReplace(key, value);
		return this;
	}

	public forEach(
		callbackfn: (value: TValue, key: TKey, map: Map<TKey, TValue>) => void,
		thisArg?: any
	): void
	{
		for (const [ k, v ] of this.entries())
		{
			callbackfn.call(thisArg, v, k, this);
		}
	}

	public* entries(): MapIterator<[ TKey, TValue ]>
	{
		let node = this.#_order.first;
		while (node)
		{
			const entry = this.#_entries.get(node.value)!;
			yield [ node.value, entry.value ];
			node = node.next;
		}
	}

	public* keys(): MapIterator<TKey>
	{
		let node = this.#_order.first;
		while (node)
		{
			yield node.value;
			node = node.next;
		}
	}

	public* values(): MapIterator<TValue>
	{
		let node = this.#_order.first;
		while (node)
		{
			yield this.#_entries.get(node.value)!.value;
			node = node.next;
		}
	}

	public [Symbol.iterator](): MapIterator<[ TKey, TValue ]>
	{
		return this.entries();
	}
}

class LruCacheEntry<TKey, TValue>
{
	#_value: TValue;
	#_node: LinkedListNode<TKey>;

	public constructor(value: TValue, node: LinkedListNode<TKey>)
	{
		this.#_value = value;
		this.#_node = node;
	}

	public get value()
	{
		return this.#_value;
	}

	public set value(value: TValue)
	{
		this.#_value = value;
	}

	public get node()
	{
		return this.#_node;
	}

	public set node(value: LinkedListNode<TKey>)
	{
		this.#_node = value;
	}
}

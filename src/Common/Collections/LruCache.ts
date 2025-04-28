import { LinkedListNode } from "./LinkedListNode";
import { LinkedList } from "./LinkedList";
import { ThrowHelper } from "../ThrowHelper";
import { ValueOutOfRangeError } from "../ValueOutOfRangeError";
import { UnreachableError } from "../UnreachableError";
import { SealedClassError } from "../SealedClassError";

/**
 * Represents a Least-Recently-Used (LRU) cache that stores key-value pairs with a fixed maximum capacity.
 *
 * When the cache exceeds its defined capacity, the least recently accessed entry is automatically evicted.
 *
 * @template TKey The type of keys maintained by the cache. Keys must be non-nullable objects.
 * @template TValue The type of mapped values. Values can be objects or `null`.
 *
 * @sealed
 */
export class LruCache<TKey extends {}, TValue extends {} | null> implements Map<TKey, TValue>
{
	readonly #_order = new LinkedList<TKey>();
	readonly #_entries = new Map<TKey, LruCacheEntry<TKey, TValue>>();
	#_size: number;
	#_ignoreNewEntries: boolean;

	/**
	 * Initializes a new instance of the {@link LruCache} class with the specified capacity.
	 * @param size The maximum number of entries the cache can hold.
	 * @param ignoreNewEntries If set to `true`, new entries will be ignored when the cache is full. Defaults to `false`.
	 */
	public constructor(size: number, ignoreNewEntries: boolean = false)
	{
		SealedClassError.throwIfNotEqual(LruCache, new.target);
		ThrowHelper.TypeError.throwIfNotType(size, "number");
		ThrowHelper.TypeError.throwIfNotType(ignoreNewEntries, "boolean");

		this.#_size = size;
		this.#_ignoreNewEntries = ignoreNewEntries;
	}

	/**
	 * Gets the current maximum capacity of the cache.
	 */
	public get size()
	{
		return this.#_size;
	}

	/**
	 * Gets whether new entries should be ignored.
	 */
	public get ignoreNewEntries()
	{
		return this.#_ignoreNewEntries;
	}

	/**
	 * Sets whether new entries should be ignored.
	 */
	public set ignoreNewEntries(value: boolean)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "boolean");
		this.#_ignoreNewEntries = value;
	}

	public get [Symbol.toStringTag](): string
	{
		return "LruCache";
	}

	/**
	 * Expands the cache's maximum capacity by a specified amount.
	 * @param extraCapacity The number of additional entries the cache should be able to store.
	 * @throws {ValueOutOfRangeError} If `extraCapacity` is negative.
	 */
	public expandSize(extraCapacity: number)
	{
		ThrowHelper.TypeError.throwIfNotType(extraCapacity, "number");
		ValueOutOfRangeError.throwIfLessThan(extraCapacity, 0);
		this.#_size += extraCapacity;
	}

	/**
	 * Retrieves the value associated with the specified key, and marks it as most recently used.
	 * @param key The key to retrieve.
	 * @returns The value associated with the key, or `undefined` if not found.
	 */
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

	/**
	 * Determines whether the cache contains the specified key.
	 * @param key The key to locate.
	 * @returns `true` if the cache contains the key; otherwise, `false`.
	 */
	public has(key: TKey)
	{
		return this.#_entries.has(key);
	}

	/**
	 * Removes all keys and values from the cache.
	 */
	public clear()
	{
		this.#_entries.clear();
		this.#_order.clear();
	}

	/**
	 * Removes the entry associated with the specified key.
	 * @param key The key to remove.
	 * @returns `true` if an entry was removed; otherwise, `false`.
	 */
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

	/**
	 * Removes the least recently used (LRU) entry from the cache.
	 * @returns `true` if an entry was removed; otherwise, `false`.
	 */
	public removeLru()
	{
		const last = this.#_order.last;
		if (last === null)
		{
			return false;
		}

		return this.remove(last.value);
	}

	/**
	 * Retrieves and removes the entry associated with the specified key.
	 * @param key The key to retrieve and remove.
	 * @returns The value associated with the removed key, or `undefined` if not found.
	 */
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

	/**
	 * Retrieves and removes the least recently used (LRU) entry.
	 * @returns The value associated with the removed LRU entry, or `undefined` if the cache is empty.
	 */
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

	/**
	 * Adds a new entry or replaces an existing entry with the specified key and value.
	 * If the cache exceeds its maximum size, the least recently used entry will be removed.
	 * @param key The key to add or replace.
	 * @param value The value to associate with the key.
	 */
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

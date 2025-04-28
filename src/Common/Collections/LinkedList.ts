import { SealedClassError } from "../SealedClassError";
import { LinkedListNode } from "./LinkedListNode";
import { InvalidOperationError } from "../InvalidOperationError";

/**
 * @sealed
 * */
export class LinkedList<T>
{
	#_count: number = 0;
	#_first: LinkedListNode<T> | null = null;
	#_last: LinkedListNode<T> | null = null;

	public constructor()
	{
		SealedClassError.throwIfNotEqual(LinkedList, new.target);
	}

	public get count()
	{
		return this.#_count;
	}

	public get first()
	{
		return this.#_first;
	}

	public get last()
	{
		return this.#_last;
	}

	public addAfter(node: LinkedListNode<T>, value: T | LinkedListNode<T>)
	{
		const newNode = value instanceof LinkedListNode
			? value
			: new LinkedListNode(value, this, node, node.next);

		InvalidOperationError.throwIf(newNode instanceof LinkedListNode && newNode.list !== this,
			"The node belongs to another list.");

		node.next = newNode;
		this.#_count++;
		return node;
	}

	public addBefore(node: LinkedListNode<T>, value: T | LinkedListNode<T>)
	{
		const newNode = value instanceof LinkedListNode
			? value
			: new LinkedListNode(value, this, node.previous, node);

		InvalidOperationError.throwIf(newNode instanceof LinkedListNode && newNode.list !== this,
			"The node belongs to another list.");

		node.previous = newNode;
		this.#_count++;
		return node;
	}

	public addFirst(value: T | LinkedListNode<T>)
	{
		let node = value instanceof LinkedListNode ? value : new LinkedListNode(value, this, null, this.#_first);
		InvalidOperationError.throwIf(value instanceof LinkedListNode && value.list !== this, "The node belongs to another list.");
		this.#_first = node;
		this.#_count++;
		return node;
	}

	public addLast(value: T | LinkedListNode<T>)
	{
		let node = value instanceof LinkedListNode ? value : new LinkedListNode(value, this, this.#_last, null);
		InvalidOperationError.throwIf(value instanceof LinkedListNode && value.list !== this, "The node belongs to another list.");
		this.#_last = node;
		this.#_count++;
		return node;
	}

	public clear()
	{
		this.#_count = 0;
		this.#_first = null;
		this.#_last = null;
	}

	public find(value: T)
	{
		if (this.#_first === null)
		{
			return null;
		}

		for (const node of this)
		{
			if (node.value === value)
			{
				return node;
			}
		}

		return null;
	}

	public findLast(value: T)
	{
		if (this.#_last === null)
		{
			return null;
		}

		let current: LinkedListNode<T> | null = this.#_last;
		while (true)
		{
			if (current === null)
			{
				return null;
			}
			if (current.value === value)
			{
				return current;
			}

			current = current.previous;
		}
	}

	public contains(value: T)
	{
		return this.find(value) !== null;
	}

	public remove(value: T | LinkedListNode<T>)
	{
		const node = value instanceof LinkedListNode ? value : this.find(value);
		if (node === null)
		{
			return false;
		}

		InvalidOperationError.throwIf(node.list !== this, "The node belongs to another list.");
		const previous = node.previous;
		const next = node.next;

		if (previous !== null)
		{
			previous.next = next;
		}

		if (next !== null)
		{
			next.previous = previous;
		}

		this.#_count--;
		return true;
	}

	public removeFirst()
	{
		const first = this.#_first;
		if (first === null)
		{
			return false;
		}

		const firstNext = first.next;
		if (firstNext !== null)
		{
			first.next = null;
			firstNext.previous = null;
		}

		this.#_first = firstNext;
		this.#_count--;
		return true;
	}

	public removeLast()
	{
		const last = this.#_last;
		if (last === null)
		{
			return false;
		}

		const lastPrevious = last.previous;
		if (lastPrevious !== null)
		{
			last.previous = null;
			lastPrevious.next = null;
		}

		this.#_last = lastPrevious;
		this.#_count--;
		return true;
	}

	public values()
	{
		return this[Symbol.iterator]();
	}

	public* [Symbol.iterator]()
	{
		let current = this.#_first;
		while (current !== null)
		{
			yield current;
			current = current.next;
		}
	}
}

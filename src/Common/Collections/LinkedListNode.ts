import { SealedClassError } from "../SealedClassError";
import { LinkedList } from "./LinkedList";
import { ThrowHelper } from "../ThrowHelper";
import { InvalidOperationError } from "../InvalidOperationError";

/**
 * @sealed
 * */
export class LinkedListNode<T>
{
	readonly #_list: LinkedList<T>;
	readonly #_value: T;
	#_previous: LinkedListNode<T> | null;
	#_next: LinkedListNode<T> | null;

	public constructor(
		value: T,
		list: LinkedList<T>,
		previous: LinkedListNode<T> | null,
		next: LinkedListNode<T> | null)
	{
		SealedClassError.throwIfNotEqual(LinkedListNode, new.target);
		ThrowHelper.TypeError.throwIfNotType(list, LinkedList);
		ThrowHelper.TypeError.throwIfNotAnyType(previous, LinkedListNode, "null");
		ThrowHelper.TypeError.throwIfNotAnyType(next, LinkedListNode, "null");

		this.#_value = value;
		this.#_list = list;
		this.#_previous = previous;
		this.#_next = next;
	}

	public get list()
	{
		return this.#_list;
	}

	public get previous()
	{
		return this.#_previous;
	}

	/**
	 * @privateRemarks Should only be called by {@link LinkedList}.
	 * @package
	 * */
	public set previous(value: LinkedListNode<T> | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(value, LinkedListNode, "null");
		InvalidOperationError.throwIf(value !== null && value.list !== this.#_list, "Parent list must be the same for both nodes.");
		this.#_previous = value;
	}

	public get next()
	{
		return this.#_next;
	}

	/**
	 * @privateRemarks Should only be called by {@link LinkedList}.
	 * @package
	 * */
	public set next(value: LinkedListNode<T> | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(value, LinkedListNode, "null");
		InvalidOperationError.throwIf(value !== null && value.list !== this.#_list, "Parent list must be the same for both nodes.");
		this.#_next = value;
	}

	public get value()
	{
		return this.#_value;
	}
}

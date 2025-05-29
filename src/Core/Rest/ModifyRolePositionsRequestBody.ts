import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";
import { ReadonlyDictionary } from "../../Common/Collections/ReadonlyDictionary";

/**
 * Represents the request body used to modify the role positions.
 * @sealed
 */
export class ModifyRolePositionsRequestBody
{
	readonly #_positions: Map<string, number> = new Map();
	#_positionsView: ReadonlyDictionary<string, number> | null = null;

	/**
	 * Initializes a new instance of {@link ModifyRolePositionsRequestBody}.
	 */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(ModifyRolePositionsRequestBody, new.target);
	}

	/**
	 * Gets a readonly key-value pair collection of role positions where the role ID is the key.
	 * */
	public get positions()
	{
		return this.#_positionsView ??= new ReadonlyDictionary(this.#_positions);
	}

	/**
	 * Sets the position of a role.
	 * @param roleId The ID of the role.
	 * @param position The new position of the role.
	 * @returns The current {@link ModifyRolePositionsRequestBody} instance.
	 * */
	public withPosition(roleId: string, position: number | null)
	{
		ThrowHelper.TypeError.throwIfNotType(roleId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(position, "number", "null");
		if (position !== null)
		{
			this.#_positions.set(roleId, position);
		}
		else
		{
			this.#_positions.delete(roleId);
		}

		return this;
	}

	/**
	 * Clears the set positions.
	 * */
	public clearPositions()
	{
		this.#_positions.clear();
	}

	public toJSON()
	{
		const obj = [];
		for (const [ roleId, position ] of this.#_positions)
		{
			obj.push({ id: roleId, position: position });
		}

		return obj;
	}
}

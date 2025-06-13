import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";
import { ReadOnlyCollection } from "../../Common/Collections/ReadOnlyCollection";
import { TypeHelper } from "../../Common/TypeHelper";
import { ArrayHelper } from "../../Common/ArrayHelper";

/**
 * Represents the request body used to modify a user.
 * @sealed
 * */
export class ModifyUserRequestBody
{
	#_displayName: string | null = null;
	#_description: string | null = null;
	#_currentRoomId: string | null = null;
	#_roleIds: string[] | null = null;
	#_roleIdsView: ReadOnlyCollection<string> | null = null;

	/**
	 * Initializes a new instance of {@link ModifyUserRequestBody}.
	 * */
	public constructor()
	{
		SealedClassError.throwIfNotEqual(ModifyUserRequestBody, new.target);
	}

	/**
	 * Gets the new display name.
	 * */
	public get displayName()
	{
		return this.#_displayName;
	}

	/**
	 * Sets the new display name.
	 * @param displayName The new display name, or `null` to do no modifications.
	 * */
	public set displayName(displayName: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(displayName, "string", "null");
		this.#_displayName = displayName;
	}

	/**
	 * Gets the new description.
	 * */
	public get description()
	{
		return this.#_description;
	}

	/**
	 * Sets the new description.
	 * @param description The new description, or `null` to do no modifications.
	 * */
	public set description(description: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(description, "string", "null");
		this.#_description = description;
	}

	/**
	 * Gets the new current room ID.
	 * */
	public get currentRoomId()
	{
		return this.#_currentRoomId;
	}

	/**
	 * Sets the new current room ID.
	 * @param currentRoomId The ID of the new room the user will move to, or `null` to do no modifications.
	 * */
	public set currentRoomId(currentRoomId: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(currentRoomId, "string", "null");
		this.#_currentRoomId = currentRoomId;
	}

	/**
	 * Gets the ID collection of the roles that will overwrite the current role values,
	 * or `null` if no modifications have been specified.
	 * */
	public get roleIds()
	{
		if (this.#_roleIds === null)
		{
			return null;
		}

		return this.#_roleIdsView ??= new ReadOnlyCollection(this.#_roleIds);
	}

	/**
	 * Sets the new display name.
	 * @param displayName The new display name, or `null` to do no modifications.
	 * @returns The current {@link GetUsersQuery} instance.
	 * */
	public withDisplayName(displayName: string | null)
	{
		this.displayName = displayName;
		return this;
	}

	/**
	 * Sets the new description.
	 * @param description The new description, or `null` to do no modifications.
	 * @returns The current {@link GetUsersQuery} instance.
	 * */
	public withDescription(description: string | null)
	{
		this.description = description;
		return this;
	}

	/**
	 * Sets the new current room ID.
	 * @param currentRoomId The ID of the new room the user will move to, or `null` to do no modifications.
	 * @returns The current {@link GetUsersQuery} instance.
	 * */
	public withCurrentRoomId(currentRoomId: string | null)
	{
		this.currentRoomId = currentRoomId;
		return this;
	}

	/**
	 * Sets the ID collection of the roles that will overwrite the current role values,
	 * or `null` if no modifications should be made.
	 * @param roleIds The ID collection of the roles.
	 * @returns The current {@link ModifyUserRequestBody} instance.
	 * */
	public withRoleIds(roleIds: Iterable<string> | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(roleIds, "iterable", "null");
		this.#_roleIds = TypeHelper.isType(roleIds, "iterable")
			? ArrayHelper.distinct(ArrayHelper.asArray(roleIds))
			: null;
		this.#_roleIdsView = null;
		return this;
	}

	public toJSON()
	{
		return {
			displayName: this.#_displayName,
			description: this.#_description,
			currentRoomId: this.#_currentRoomId,
			roleIds: this.#_roleIds,
		} as unknown;
	}
}

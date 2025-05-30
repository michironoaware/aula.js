import { RestClient } from "../RestClient";
import { RoleData } from "./Models/RoleData";
import { ThrowHelper } from "../../../Common/ThrowHelper";

export class Role
{
	readonly #_restClient: RestClient;
	readonly #_data: RoleData;
	#_permissions: bigint | null = null;
	#_creationDate: Date | null = null;

	/**
	 * Initializes a new instance of {@link Role}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: RoleData, restClient: RestClient)
	{
		ThrowHelper.TypeError.throwIfNotType(data, RoleData);
		//ThrowHelper.TypeError.throwIfNotType(restClient, RestClient); // Circular dependency problem

		this.#_restClient = restClient;
		this.#_data = data;
	}

	/**
	 * Gets the {@link RestClient} that initialized this instance.
	 * */
	public get restClient()
	{
		return this.#_restClient;
	}

	/**
	 * Gets the ID of the role.
	 * */
	public get id()
	{
		return this.#_data.id;
	}

	/**
	 * Gets the name of the role.
	 * */
	public get name()
	{
		return this.#_data.name;
	}

	/**
	 * Gets the permission bit flags of the role.
	 * */
	public get permissions()
	{
		return this.#_permissions ??= BigInt(this.#_data.permissions);
	}

	/**
	 * Gets the position of the role in the hierarchy.
	 * */
	public get position()
	{
		return this.#_data.position;
	}

	/**
	 * Gets whether the role is the global role.
	 * */
	public get isGlobal()
	{
		return this.#_data.isGlobal;
	}

	/**
	 * Gets the creation date of the role as a {@link Date} object.
	 * */
	public get creationDate()
	{
		return this.#_creationDate ??= new Date(this.#_data.creationDate);
	}
}

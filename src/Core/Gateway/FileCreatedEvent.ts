import { File } from "../Rest/Entities/File";
import { GatewayClient } from "./GatewayClient";
import { SealedClassError } from "../../Common/SealedClassError";
import { ThrowHelper } from "../../Common/ThrowHelper";

/**
 * Emitted when a file is created.
 * @sealed
 * */
export class FileCreatedEvent
{
	readonly #_file: File;
	readonly #_gatewayClient: GatewayClient;

	/**
	 * @package
	 * */
	public constructor(file: File, gatewayClient: GatewayClient)
	{
		SealedClassError.throwIfNotEqual(FileCreatedEvent, new.target);
		ThrowHelper.TypeError.throwIfNotType(file, File);
		//ThrowHelper.TypeError.throwIfNotType(gatewayClient, GatewayClient); // Circular dependency problem

		this.#_file = file;
		this.#_gatewayClient = gatewayClient;
	}

	/**
	 * Gets the id of the file created.
	 * */
	public get file()
	{
		return this.#_file;
	}

	/**
	 * Gets the {@link GatewayClient} that initialized this instance.
	 * */
	public get gatewayClient()
	{
		return this.#_gatewayClient;
	}
}

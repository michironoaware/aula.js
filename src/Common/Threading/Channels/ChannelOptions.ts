import { ThrowHelper } from "../../ThrowHelper.js";

export abstract class ChannelOptions
{
	readonly #_singleWriter: boolean;
	readonly #_singleReader: boolean;

	protected constructor(singleWriter: boolean, singleReader: boolean)
	{
		ThrowHelper.TypeError.throwIfNotType(singleWriter, "boolean");
		ThrowHelper.TypeError.throwIfNotType(singleReader, "boolean");

		this.#_singleWriter = singleWriter;
		this.#_singleReader = singleReader;
	}

	public get singleReader()
	{
		return this.#_singleReader;
	}

	public get singleWriter()
	{
		return this.#_singleWriter;
	}
}

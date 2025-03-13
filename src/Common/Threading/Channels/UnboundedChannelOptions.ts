import { ChannelOptions } from "./ChannelOptions.js";
import { SealedClassError } from "../../SealedClassError.js";

export class UnboundedChannelOptions extends ChannelOptions
{
	public constructor(singleWriter: boolean, singleReader: boolean)
	{
		super(singleWriter, singleReader);
		SealedClassError.throwIfNotEqual(UnboundedChannelOptions, new.target);
	}
}

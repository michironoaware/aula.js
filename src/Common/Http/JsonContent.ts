import { StringContent } from "./StringContent.js";
import { SealedClassError } from "../SealedClassError.js";
import { BigIntJsonReplacer } from "../Json/BigIntJsonReplacer.js";

/**
 * Provides HTTP content based on JSON.
 * */
export class JsonContent extends StringContent
{
	/**
	 * Initializes a new instance of {@link JsonContent}
	 * @param value The value to serialize and provide as JSON.
	 * */
	public constructor(value: unknown)
	{
		super(JSON.stringify(value, BigIntJsonReplacer), "application/json");
		SealedClassError.throwIfNotEqual(JsonContent, new.target);
	}
}

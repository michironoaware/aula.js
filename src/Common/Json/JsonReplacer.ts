import { NullJsonReplacer } from "./NullJsonReplacer.js";
import { BigIntJsonReplacer } from "./BigIntJsonReplacer.js";

export const JsonReplacer = (key: unknown, value: unknown) =>
{
	return NullJsonReplacer(key, BigIntJsonReplacer(key, value));
};

import { NullJsonReplacer } from "./NullJsonReplacer";
import { BigIntJsonReplacer } from "./BigIntJsonReplacer";

export const JsonReplacer = (key: unknown, value: unknown) =>
{
	return NullJsonReplacer(key, BigIntJsonReplacer(key, value));
};

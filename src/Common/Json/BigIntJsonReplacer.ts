export const BigIntJsonReplacer = (_1: unknown, value: unknown) =>
{
	return typeof value === "bigint" ? value.toString() : value;
};

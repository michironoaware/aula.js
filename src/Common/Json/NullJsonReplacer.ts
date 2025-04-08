export const NullJsonReplacer = (_1: unknown, value: unknown) =>
{
	return value === null ? undefined : value;
};

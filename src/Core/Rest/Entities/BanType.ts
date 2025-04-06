export const BanType =
{
	Id: 0,
} as const;

Object.freeze(BanType);

export type BanType = typeof BanType[keyof typeof BanType];

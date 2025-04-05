export const BanType: {
	Id: 0,
} =
{
	Id: 0,
}

Object.freeze(BanType);

export type BanType = typeof BanType[keyof typeof BanType];

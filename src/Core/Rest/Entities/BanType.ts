﻿/**
 * Enumerates the type of bans within Aula.
 * */
export const BanType =
	{
		/**
		 * A ban applied over a user.
		 * */
		User: 0,
	} as const;

Object.freeze(BanType);

export type BanType = typeof BanType[keyof typeof BanType] | number;

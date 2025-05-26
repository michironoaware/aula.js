/**
 * Enumerates the type of entities that can issue a ban within Aula.
 * */
export const BanIssuerType =
	{
		/*
		* The system.
		* */
		System: 0,

		/**
		 * An aula user.
		 * */
		User: 1,
	} as const;

Object.freeze(BanIssuerType);

export type BanIssuerType = typeof BanIssuerType[keyof typeof BanIssuerType] | number;

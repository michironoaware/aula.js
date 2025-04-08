export interface IRegisterRequestBody
{
	readonly userName: string;
	readonly displayName?: string | null;
	readonly email: string;
	readonly password: string;
}

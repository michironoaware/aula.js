export interface IRegisterRequestBody
{
	readonly userName: string;
	readonly displayName?: string;
	readonly email: string;
	readonly password: string;
}

export interface IResetPasswordRequestBody
{
	readonly code: string;
	readonly newPassword: string;
}

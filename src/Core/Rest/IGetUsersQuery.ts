import { UserType } from "./Entities/UserType.js";

export interface IGetUsersQuery
{
	readonly type?: UserType | null;
	readonly count?: number | null;
	readonly after?: string | null;
}

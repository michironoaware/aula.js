import {UserType} from "../Entities/UserType.js";

export interface IGetUsersQuery
{
	readonly type?: UserType;
	readonly count?: number;
	readonly after?: string;
}

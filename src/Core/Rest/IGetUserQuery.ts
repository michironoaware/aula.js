import {UserType} from "../Entities/UserType.js";

export interface IGetUserQuery
{
	readonly type?: UserType;
	readonly count?: number;
	readonly after?: string;
}

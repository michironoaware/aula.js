import {UserType} from "../Entities/UserType.js";

export interface IModifyCurrentUserRequestBody
{
	readonly displayName?: string;
	readonly description?: string;
}

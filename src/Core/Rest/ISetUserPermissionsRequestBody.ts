import { Permissions } from "../Entities/Permissions.js";

export interface ISetUserPermissionsRequestBody
{
	readonly permissions: Permissions;
}

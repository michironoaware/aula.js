import { TypeHelper } from "../Common/TypeHelper";
import { ThrowHelper } from "../Common/ThrowHelper";

/**
 * @package
 * */
export namespace AulaRoute
{
	export function bans(
		route?: undefined,
		query?: {
			type?: number | null,
			count?: number | null,
			after?: string | null,
			includeLifted?: boolean | null
		})
	{
		if (!TypeHelper.isNullable(query))
		{
			ThrowHelper.TypeError.throwIfNotAnyType(query.type, "number", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(query.count, "number", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(query.after, "string", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(query.includeLifted, "boolean", "nullable");
		}

		return "bans" +
		       (!TypeHelper.isNullable(query) ? "?" : "") +
		       (query?.type ? `type=${query.type}` : "") +
		       (query?.count ? `&count=${query.count}` : "") +
		       (query?.after ? `&after=${query.after}` : "") +
		       (query?.includeLifted ? `&includeLifted=${query.includeLifted}` : "");
	}

	export function ban(route: { banId: string })
	{
		ThrowHelper.TypeError.throwIfNullable(route);
		ThrowHelper.TypeError.throwIfNotType(route.banId, "string");

		return `bans/${route.banId}`;
	}

	export function banLift(route: { banId: string })
	{
		ThrowHelper.TypeError.throwIfNullable(route);
		ThrowHelper.TypeError.throwIfNotType(route.banId, "string");

		return `bans/${route.banId}/lift`;
	}

	export function bots()
	{
		return "bots";
	}

	export function bot(route: { userId: string })
	{
		ThrowHelper.TypeError.throwIfNullable(route);
		ThrowHelper.TypeError.throwIfNotType(route.userId, "string");

		return `bots/${route.userId}`;
	}

	export function resetBotToken(route: { userId: string })
	{
		ThrowHelper.TypeError.throwIfNullable(route);
		ThrowHelper.TypeError.throwIfNotType(route.userId, "string");

		return `bots/${route.userId}/reset-token`;
	}

	export function files(route?: undefined, query?: { after?: string | null, count?: number | null })
	{
		if (!TypeHelper.isNullable(query))
		{
			ThrowHelper.TypeError.throwIfNotAnyType(query.count, "number", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(query.after, "string", "nullable");
		}

		return "files" +
		       (!TypeHelper.isNullable(query) ? "?" : "") +
		       (query?.count ? `count=${query.count}` : "") +
		       (query?.after ? `&after=${query.after}` : "");
	}

	export function file(route: { fileId: string })
	{
		ThrowHelper.TypeError.throwIfNullable(route);
		ThrowHelper.TypeError.throwIfNotType(route.fileId, "string");

		return `files/${route.fileId}`;
	}

	export function fileContent(route: { fileId: string })
	{
		return `files/${route.fileId}/content`;
	}

	export function gateway()
	{
		return "gateway";
	}

	export function register()
	{
		return "identity/register";
	}

	export function logIn()
	{
		return "identity/log-in";
	}

	export function confirmEmail(route: undefined, query?: { email?: string | null, token?: string | null })
	{
		ThrowHelper.TypeError.throwIfNullable(query);
		if (!TypeHelper.isNullable(query))
		{
			ThrowHelper.TypeError.throwIfNotAnyType(query.email, "string", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(query.token, "string", "nullable");
		}

		return `identity/confirm-email` +
		       (!TypeHelper.isNullable(query) ? "?" : "") +
		       (query?.email ? `email=${query.email}&` : "") +
		       (query?.token ? `token=${query.token}` : "");
	}

	export function forgotPassword(route: undefined, query?: { email?: string | null })
	{
		ThrowHelper.TypeError.throwIfNullable(query);
		if (!TypeHelper.isNullable(query))
		{
			ThrowHelper.TypeError.throwIfNotType(query.email, "string");
		}

		return `identity/forgot-password` +
		       (!TypeHelper.isNullable(query) ? "?" : "") +
		       (query?.email ? `email=${query.email}` : "");
	}

	export function resetPassword()
	{
		return "identity/reset-password";
	}

	export function logOut()
	{
		return "identity/log-out";
	}

	export function deleteIdentity()
	{
		return "identity/delete";
	}

	export function startTyping(route: { roomId: string })
	{
		ThrowHelper.TypeError.throwIfNullable(route);
		ThrowHelper.TypeError.throwIfNotType(route.roomId, "string");

		return `rooms/${route.roomId}/start-typing`;
	}

	export function messages(
		route: { roomId: string },
		query?: { count?: number | null, before?: string | null, after?: string | null })
	{
		ThrowHelper.TypeError.throwIfNullable(route);
		ThrowHelper.TypeError.throwIfNotType(route.roomId, "string");
		if (!TypeHelper.isNullable(query))
		{
			ThrowHelper.TypeError.throwIfNotAnyType(query.count, "number", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(query.before, "string", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(query.after, "string", "nullable");
		}

		return `rooms/${route.roomId}/messages` +
		       (!TypeHelper.isNullable(query) ? "?" : "") +
		       (query?.count ? `count=${query.count}` : "") +
		       (query?.before ? `&before=${query.before}` : "") +
		       (query?.after ? `&after=${query.after}` : "");
	}

	export function message(route: { roomId: string, messageId: string })
	{
		ThrowHelper.TypeError.throwIfNullable(route);
		ThrowHelper.TypeError.throwIfNotType(route.roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(route.messageId, "string");

		return `rooms/${route.roomId}/messages/${route.messageId}`;
	}

	export function ping()
	{
		return "ping";
	}

	export function roles(route?: undefined, query?: { count?: number | null, after?: string | null })
	{
		if (!TypeHelper.isNullable(query))
		{
			ThrowHelper.TypeError.throwIfNotAnyType(query.count, "number", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(query.after, "string", "nullable");
		}

		return "roles" +
		       (!TypeHelper.isNullable(query) ? "?" : "") +
		       (query?.count ? `count=${query.count}` : "") +
		       (query?.after ? `&after=${query.after}` : "");
	}

	export function role(route: { roleId: string })
	{
		ThrowHelper.TypeError.throwIfNullable(route);
		ThrowHelper.TypeError.throwIfNotType(route.roleId, "string");

		return `roles/${route.roleId}`;
	}

	export function rooms(route?: undefined, query?: { count?: number | null, after?: string | null })
	{
		if (!TypeHelper.isNullable(query))
		{
			ThrowHelper.TypeError.throwIfNotAnyType(query.count, "number", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(query.after, "string", "nullable");
		}

		return "rooms" +
		       (!TypeHelper.isNullable(query) ? "?" : "") +
		       (query?.count ? `count=${query.count}` : "") +
		       (query?.after ? `&after=${query.after}` : "");
	}

	export function room(route: { roomId: string })
	{
		ThrowHelper.TypeError.throwIfNullable(route);
		ThrowHelper.TypeError.throwIfNotType(route.roomId, "string");

		return `rooms/${route.roomId}`;
	}

	export function roomDestinations(route: { roomId: string })
	{
		ThrowHelper.TypeError.throwIfNullable(route);
		ThrowHelper.TypeError.throwIfNotType(route.roomId, "string");

		return `rooms/${route.roomId}/destinations`;
	}

	export function roomDestination(route: { roomId: string, destinationId: string })
	{
		ThrowHelper.TypeError.throwIfNullable(route);
		ThrowHelper.TypeError.throwIfNotType(route.roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(route.destinationId, "string");

		return `rooms/${route.roomId}/destinations/${route.destinationId}`;
	}

	export function roomResidents(route: { roomId: string })
	{
		ThrowHelper.TypeError.throwIfNullable(route);
		ThrowHelper.TypeError.throwIfNotType(route.roomId, "string");

		return `rooms/${route.roomId}/residents`;
	}

	export function currentUser()
	{
		return "users/@me";
	}

	export function users(route?: undefined, query?: { type?: number | null, count?: number | null, after?: string | null })
	{
		if (!TypeHelper.isNullable(query))
		{
			ThrowHelper.TypeError.throwIfNotAnyType(query.type, "number", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(query.count, "number", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(query.after, "string", "nullable");
		}

		return "users" +
		       (!TypeHelper.isNullable(query) ? "?" : "") +
		       (query?.type ? `type=${query.type}` : "") +
		       (query?.count ? `&count=${query.count}` : "") +
		       (query?.after ? `&after=${query.after}` : "");
	}

	export function user(route: { userId: string })
	{
		ThrowHelper.TypeError.throwIfNullable(route);
		ThrowHelper.TypeError.throwIfNotType(route.userId, "string");

		return `users/${route.userId}`;
	}

	export function currentUserBanStatus()
	{
		return "users/@me/ban-status";
	}

	export function userRole(route: { userId: string, roleId: string })
	{
		ThrowHelper.TypeError.throwIfNullable(route);
		ThrowHelper.TypeError.throwIfNotType(route.userId, "string");
		ThrowHelper.TypeError.throwIfNotType(route.roleId, "string");

		return `users/${route.userId}/roles/${route.roleId}`;
	}

	export function userBans(route: { userId: string })
	{
		ThrowHelper.TypeError.throwIfNullable(route);
		ThrowHelper.TypeError.throwIfNotType(route.userId, "string");

		return `users/${route.userId}/bans`;
	}
}

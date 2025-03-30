import { TypeHelper } from "../Common/TypeHelper.js";
import { ThrowHelper } from "../Common/ThrowHelper.js";

export namespace AulaRoute
{
	export function currentUser()
	{
		return "users/@me";
	}

	export function users(args?: { query?: { type?: number, count?: number, after?: string } })
	{
		if (!TypeHelper.isNullable(args) &&
		    !TypeHelper.isNullable(args.query))
		{
			ThrowHelper.TypeError.throwIfNotAnyType(args.query.type, "number", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(args.query.count, "number", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(args.query.after, "string", "nullable");
		}

		return "users" +
		       (!TypeHelper.isNullable(args?.query) ? "?" : "") +
		       (args?.query?.type ? `type=${args.query.type}` : "") +
		       (args?.query?.count ? `&count=${args.query.count}` : "") +
		       (args?.query?.after ? `&after=${args.query.after}` : "");
	}

	export function user(args: { route: { userId: string } })
	{
		ThrowHelper.TypeError.throwIfNullable(args);
		ThrowHelper.TypeError.throwIfNullable(args.route);
		ThrowHelper.TypeError.throwIfNotType(args.route.userId, "string");

		return `users/${args.route.userId}`;
	}

	export function currentUserRoom()
	{
		return "users/@me/current-room";
	}

	export function userRoom(args: { route: { userId: string } })
	{
		ThrowHelper.TypeError.throwIfNullable(args);
		ThrowHelper.TypeError.throwIfNullable(args.route);
		ThrowHelper.TypeError.throwIfNotType(args.route.userId, "string");

		return `users/${args.route.userId}/current-room`;
	}

	export function userPermissions(args: { route: { userId: string } })
	{
		ThrowHelper.TypeError.throwIfNullable(args);
		ThrowHelper.TypeError.throwIfNullable(args.route);
		ThrowHelper.TypeError.throwIfNotType(args.route.userId, "string");

		return `users/${args.route.userId}/permissions`;
	}

	export function rooms(args?: { query?: { count?: number, after?: string } })
	{
		if (!TypeHelper.isNullable(args) &&
		    !TypeHelper.isNullable(args.query))
		{
			ThrowHelper.TypeError.throwIfNotAnyType(args.query.count, "number", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(args.query.after, "string", "nullable");
		}

		return "rooms" +
		       (!TypeHelper.isNullable(args?.query) ? "?" : "") +
		       (args?.query?.count ? `count=${args.query.count}` : "") +
		       (args?.query?.after ? `&after=${args.query.after}` : "");
	}

	export function room(args: { route: { roomId: string } })
	{
		ThrowHelper.TypeError.throwIfNullable(args);
		ThrowHelper.TypeError.throwIfNullable(args.route);
		ThrowHelper.TypeError.throwIfNotType(args.route.roomId, "string");

		return `rooms/${args.route.roomId}`;
	}

	export function roomConnections(args: { route: { roomId: string } })
	{
		ThrowHelper.TypeError.throwIfNullable(args);
		ThrowHelper.TypeError.throwIfNullable(args.route);
		ThrowHelper.TypeError.throwIfNotType(args.route.roomId, "string");

		return `rooms/${args.route.roomId}/connections`;
	}

	export function roomConnection(args: { route: { roomId: string, targetId: string } })
	{
		ThrowHelper.TypeError.throwIfNullable(args);
		ThrowHelper.TypeError.throwIfNullable(args.route);
		ThrowHelper.TypeError.throwIfNotType(args.route.roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(args.route.targetId, "string");

		return `rooms/${args.route.roomId}/connections/${args.route.targetId}`;
	}

	export function roomUsers(args: { route: { roomId: string } })
	{
		ThrowHelper.TypeError.throwIfNullable(args);
		ThrowHelper.TypeError.throwIfNullable(args.route);
		ThrowHelper.TypeError.throwIfNotType(args.route.roomId, "string");

		return `rooms/${args.route.roomId}/users`;
	}

	export function startTyping(args: { route: { roomId: string } })
	{
		ThrowHelper.TypeError.throwIfNullable(args);
		ThrowHelper.TypeError.throwIfNullable(args.route);
		ThrowHelper.TypeError.throwIfNotType(args.route.roomId, "string");

		return `rooms/${args.route.roomId}/start-typing`;
	}

	export function stopTyping(args: { route: { roomId: string } })
	{
		ThrowHelper.TypeError.throwIfNullable(args);
		ThrowHelper.TypeError.throwIfNullable(args.route);
		ThrowHelper.TypeError.throwIfNotType(args.route.roomId, "string");

		return `rooms/${args.route.roomId}/stop-typing`;
	}

	export function roomMessages(args: { route: { roomId: string }, query?: { count?: number, before?: string, after?: string } })
	{
		ThrowHelper.TypeError.throwIfNullable(args);
		ThrowHelper.TypeError.throwIfNullable(args.route);
		ThrowHelper.TypeError.throwIfNotType(args.route.roomId, "string");
		if (!TypeHelper.isNullable(args.query))
		{
			ThrowHelper.TypeError.throwIfNotAnyType(args.query.count, "number", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(args.query.before, "string", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(args.query.after, "string", "nullable");
		}

		return `rooms/${args.route.roomId}/messages` +
		       (!TypeHelper.isNullable(args?.query) ? "?" : "") +
		       (args.query?.count ? `count=${args.query.count}` : "") +
		       (args.query?.before ? `&before=${args.query.before}` : "") +
		       (args.query?.after ? `&after=${args.query.after}` : "");
	}

	export function roomMessage(args: { route: { roomId: string, messageId: string } })
	{
		ThrowHelper.TypeError.throwIfNullable(args);
		ThrowHelper.TypeError.throwIfNullable(args.route);
		ThrowHelper.TypeError.throwIfNotType(args.route.roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(args.route.messageId, "string");

		return `rooms/${args.route.roomId}/messages/${args.route.messageId}`;
	}

	export function bans(args?: { query?: { type?: number, count?: number, after?: string } })
	{
		if (!TypeHelper.isNullable(args) &&
		    !TypeHelper.isNullable(args.query))
		{
			ThrowHelper.TypeError.throwIfNotAnyType(args.query.type, "number", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(args.query.count, "number", "nullable");
			ThrowHelper.TypeError.throwIfNotAnyType(args.query.after, "string", "nullable");
		}

		return "bans/users" +
		       (!TypeHelper.isNullable(args?.query) ? "?" : "") +
		       (args?.query?.type ? `type=${args.query.type}` : "") +
		       (args?.query?.count ? `&count=${args.query.count}` : "") +
		       (args?.query?.after ? `&after=${args.query.after}` : "");
	}

	export function userBan(args: { route: { userId: string } })
	{
		ThrowHelper.TypeError.throwIfNullable(args);
		ThrowHelper.TypeError.throwIfNullable(args.route);
		ThrowHelper.TypeError.throwIfNotType(args.route.userId, "string");

		return `bans/users/${args.route.userId}`;
	}

	export function currentUserBanStatus()
	{
		return `bans/users/@me`;
	}

	export function register()
	{
		return "identity/register";
	}

	export function logIn()
	{
		return "identity/log-in";
	}

	export function confirmEmail(args: { query: { email: string, token?: string } })
	{
		ThrowHelper.TypeError.throwIfNullable(args);
		ThrowHelper.TypeError.throwIfNullable(args.query);
		ThrowHelper.TypeError.throwIfNotType(args.query.email, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(args.query.email, "string", "nullable");

		return `identity/confirm-email?email=${args.query.email}` +
		       (args.query?.token ? `&token=${args.query.token}` : "");
	}

	export function forgotPassword(args: { query: { email: string } })
	{
		ThrowHelper.TypeError.throwIfNullable(args);
		ThrowHelper.TypeError.throwIfNullable(args.query);
		ThrowHelper.TypeError.throwIfNotType(args.query.email, "string");

		return `identity/forgot-password?email=${args.query.email}`;
	}

	export function resetPassword()
	{
		return "identity/reset-password";
	}

	export function resetToken()
	{
		return "identity/reset-token";
	}

	export function bots()
	{
		return "bots";
	}

	export function bot(args: { route: { userId: string } })
	{
		ThrowHelper.TypeError.throwIfNullable(args);
		ThrowHelper.TypeError.throwIfNullable(args.route);
		ThrowHelper.TypeError.throwIfNotType(args.route.userId, "string");

		return `bots/${args.route.userId}`;
	}

	export function resetBotToken(args: { route: { userId: string } })
	{
		ThrowHelper.TypeError.throwIfNullable(args);
		ThrowHelper.TypeError.throwIfNullable(args.route);
		ThrowHelper.TypeError.throwIfNotType(args.route.userId, "string");

		return `bots/${args.route.userId}/reset-token`;
	}

	export function content(args: { route: { fileId: string } })
	{
		ThrowHelper.TypeError.throwIfNullable(args);
		ThrowHelper.TypeError.throwIfNullable(args.route);
		ThrowHelper.TypeError.throwIfNotType(args.route.fileId, "string");

		return `content/${args.route.fileId}`;
	}
}

export class AulaRoute
{
	public static currentUser()
	{
		return "users/@me";
	}

	public static users(args?: { query?: { type?: number, count?: number, after?: string } })
	{
		return "users" +
			(typeof args?.query !== "undefined" ? "?" : "") +
			(args?.query?.type ? `type=${args.query.type}` : "") +
			(args?.query?.count ? `&count=${args.query.count}` : "") +
			(args?.query?.after ? `&after=${args.query.after}` : "");
	}

	public static user(args: { route: {userId: string} })
	{
		return `users/${args.route.userId}`;
	}

	public static currentUserRoom()
	{
		return "users/@me/current-room";
	}

	public static userRoom(args: { route: { userId: string } })
	{
		return `users/${args.route.userId}/current-room`;
	}

	public static userPermissions(args: { route: { userId: string } })
	{
		return `users/${args.route.userId}/permissions`;
	}

	public static rooms(args?: { query?: { count?: number, after?: string } })
	{
		return "rooms" +
			(typeof args?.query !== "undefined" ? "?" : "") +
			(args?.query?.count ? `count=${args.query.count}` : "") +
			(args?.query?.after ? `&after=${args.query.after}` : "");
	}

	public static room(args: { route: { roomId: string } })
	{
		return `rooms${args.route.roomId}`;
	}

	public static roomConnections(args: { route: { roomId: string } })
	{
		return `rooms${args.route.roomId}/connections`;
	}

	public static roomConnection(args: { route: { roomId: string, targetId: string } })
	{
		return `rooms${args.route.roomId}/connections/${args.route.targetId}`;
	}

	public static roomUsers(args: { route: { roomId: string } })
	{
		return `rooms${args.route.roomId}/users`;
	}

	public static startTyping(args: { route: { roomId: string } })
	{
		return `rooms/${args.route.roomId}/start-typing`;
	}

	public static stopTyping(args: { route: { roomId: string } })
	{
		return `rooms/${args.route.roomId}/stop-typing`;
	}

	public static roomMessages(args: { route: { roomId: string }, query?: { count?: number, before?: string, after?: string } })
	{
		return `rooms/${args.route.roomId}/messages` +
			(typeof args?.query !== "undefined" ? "?" : "") +
			(args.query?.count ? `count=${args.query.count}` : "") +
			(args.query?.before ? `&before=${args.query.before}` : "") +
			(args.query?.after ? `&after=${args.query.after}` : "");
	}

	public static roomMessage(args: { route: { roomId: string, messageId: string } })
	{
		return `rooms/${args.route.roomId}/messages/${args.route.messageId}`;
	}

	public static userBans()
	{
		return "bans/users";
	}

	public static userBan(args: { route: { userId: string } })
	{
		return `bans/users/${args.route.userId}`;
	}

	public static currentUserBanStatus()
	{
		return `bans/users/@me`;
	}

	public static register()
	{
		return "identity/register";
	}

	public static logIn()
	{
		return "identity/log-in";
	}

	public static confirmEmail(args: { query: { email: string, token?: string } })
	{
		return `identity/confirm-email?email=${args.query.email}` +
			(args.query?.token ? `&token=${args.query.token}` : "");
	}

	public static forgotPassword(args: { query: { email: string } })
	{
		return `identity/forgot-password?email=${args.query.email}`;
	}

	public static resetPassword()
	{
		return "identity/reset-password";
	}

	public static resetToken()
	{
		return "identity/reset-token"
	}

	public static bots()
	{
		return "bots";
	}

	public static bot(args: { route: { userId: string } })
	{
		return `bots/${args.route.userId}`;
	}

	public static resetBotToken(args: { route: { userId: string } })
	{
		return `bots/${args.route.userId}/reset-token`;
	}
}

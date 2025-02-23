export class AulaRoute
{
	public static CurrentUser()
	{
		return "users/@me";
	}

	public static Users(args?: { query?: { type?: number, count?: number, after?: string } })
	{
		return "users" +
			(typeof args?.query !== "undefined" ? "?" : "") +
			(args?.query?.type ? `type=${args.query.type}` : "") +
			(args?.query?.count ? `&count=${args.query.count}` : "") +
			(args?.query?.after ? `&after=${args.query.after}` : "");
	}

	public static User(args: { route: {userId: string} })
	{
		return `users/${args.route.userId}`;
	}

	public static CurrentUserRoom()
	{
		return "users/@me/current-room";
	}

	public static UserRoom(args: { route: { userId: string } })
	{
		return `users/${args.route.userId}/current-room`;
	}

	public static UserPermissions(args: { route: { userId: string } })
	{
		return `users/${args.route.userId}/permissions`;
	}

	public static Rooms(args?: { query?: { count?: number, after?: string } })
	{
		return "rooms" +
			(typeof args?.query !== "undefined" ? "?" : "") +
			(args?.query?.count ? `count=${args.query.count}` : "") +
			(args?.query?.after ? `&after=${args.query.after}` : "");
	}

	public static Room(args: { route: { roomId: string } })
	{
		return `rooms${args.route.roomId}`;
	}

	public static RoomConnections(args: { route: { roomId: string } })
	{
		return `rooms${args.route.roomId}/connections`;
	}

	public static RoomConnection(args: { route: { roomId: string, targetId: string } })
	{
		return `rooms${args.route.roomId}/connections/${args.route.targetId}`;
	}

	public static RoomUsers(args: { route: { roomId: string } })
	{
		return `rooms${args.route.roomId}/users`;
	}

	public static StartTyping(args: { route: { roomId: string } })
	{
		return `rooms/${args.route.roomId}/start-typing`;
	}

	public static StopTyping(args: { route: { roomId: string } })
	{
		return `rooms/${args.route.roomId}/stop-typing`;
	}

	public static RoomMessages(args: { route: { roomId: string }, query?: { count?: number, before?: string, after?: string } })
	{
		return `rooms/${args.route.roomId}/messages` +
			(typeof args?.query !== "undefined" ? "?" : "") +
			(args.query?.count ? `count=${args.query.count}` : "") +
			(args.query?.before ? `&before=${args.query.before}` : "") +
			(args.query?.after ? `&after=${args.query.after}` : "");
	}

	public static RoomMessage(args: { route: { roomId: string, messageId: string } })
	{
		return `rooms/${args.route.roomId}/messages/${args.route.messageId}`;
	}

	public static UserBans()
	{
		return "bans/users";
	}

	public static UserBan(args: { route: { userId: string } })
	{
		return `bans/users/${args.route.userId}`;
	}

	public static CurrentUserBanStatus()
	{
		return `bans/users/@me`;
	}

	public static Register()
	{
		return "identity/register";
	}

	public static LogIn()
	{
		return "identity/log-in";
	}

	public static ConfirmEmail(args: { query: { email: string, token?: string } })
	{
		return `identity/confirm-email?email=${args.query.email}` +
			(args.query?.token ? `&token=${args.query.token}` : "");
	}

	public static ForgotPassword(args: { query: { email: string } })
	{
		return `identity/forgot-password?email=${args.query.email}`;
	}

	public static ResetPassword()
	{
		return "identity/reset-password";
	}

	public static ResetToken()
	{
		return "identity/reset-token"
	}

	public static Bots()
	{
		return "bots";
	}

	public static Bot(args: { route: { userId: string } })
	{
		return `bots/${args.route.userId}`;
	}

	public static ResetBotToken(args: { route: { userId: string } })
	{
		return `bots/${args.route.userId}/reset-token`;
	}
}

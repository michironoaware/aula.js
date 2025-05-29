import { RestClient } from "../RestClient";
import { MessageData } from "./Models/MessageData";
import { MessageType } from "./MessageType";
import { Message } from "./Message";
import { DefaultMessage } from "./DefaultMessage";
import { UserJoinMessage } from "./UserJoinMessage";
import { UserLeaveMessage } from "./UserLeaveMessage";
import { BanData } from "./Models/BanData";
import { BanType } from "./BanType";
import { Ban } from "./Ban";
import { UserBan } from "./UserBan";
import { RoomData } from "./Models/RoomData";
import { Room } from "./Room";
import { RoomType } from "./RoomType";
import { StandardRoom } from "./StandardRoom";
import { User } from "./User";
import { UserData } from "./Models/UserData";
import { UserType } from "./UserType";
import { StandardUser } from "./StandardUser";
import { BotUser } from "./BotUser";

/**
 * @privateRemarks Adding a static `create` method to base entity types is not possible
 *                 Due to some environments not supporting circular dependencies.
 *                 This namespace serves as a place for these methods.
 * @package
 */
export namespace EntityFactory
{
	/**
	 * Initializes a new instance of a {@link Message}, given the input parameters.
	 * @package
	 * */
	export function createMessage(data: MessageData, restClient: RestClient): Message
	{
		switch (data.type)
		{
			case MessageType.Default:
				return new DefaultMessage(data, restClient);
			case MessageType.UserJoin:
				return new UserJoinMessage(data, restClient);
			case MessageType.UserLeave:
				return new UserLeaveMessage(data, restClient);
			default:
				return new Message(data, restClient);
		}
	}

	/**
	 * Initializes a new instance of a {@link Ban}, given the input parameters.
	 * @package
	 * */
	export function createBan(data: BanData, restClient: RestClient): Ban
	{
		switch (data.type)
		{
			case BanType.User:
				return new UserBan(data, restClient);
			default:
				return new Ban(data, restClient);
		}
	}

	/**
	 * Initializes a new instance of a {@link Room}, given the input parameters.
	 * @package
	 * */
	export function createRoom(data: RoomData, restClient: RestClient): Room
	{
		switch (data.type)
		{
			case RoomType.Standard:
				return new StandardRoom(data, restClient);
			default:
				return new Room(data, restClient);
		}
	}

	/**
	 * Initializes a new instance of a {@link User}, given the input parameters.
	 * @package
	 * */
	export function createUser(data: UserData, restClient: RestClient): User
	{
		switch (data.type)
		{
			case UserType.Standard:
				return new StandardUser(data, restClient);
			case UserType.Bot:
				return new BotUser(data, restClient);
			default:
				return new User(data, restClient);
		}
	}
}

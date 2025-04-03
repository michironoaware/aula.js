import { RestClient } from "../RestClient.js";
import { InvalidOperationError } from "../../../Common/InvalidOperationError.js";
import { MessageData } from "./Models/MessageData.js";
import { MessageType } from "./MessageType.js";
import { Message } from "./Message.js";
import { StandardMessage } from "./StandardMessage.js";
import { UserJoinMessage } from "./UserJoinMessage.js";
import { UserLeaveMessage } from "./UserLeaveMessage.js";
import { BanData } from "./Models/BanData.js";
import { BanType } from "./BanType.js";
import { Ban } from "./Ban.js";
import { UserBan } from "./UserBan.js";
import { RoomData } from "./Models/RoomData.js";
import { Room } from "./Room.js";
import { RoomType } from "./RoomType.js";
import { TextRoom } from "./TextRoom.js";

/**
 * Adding a static `create` method to base entity types is not possible
 * Due to some environments not supporting circular dependencies.
 * This namespace serves as a place for these methods.
 * @package
 */
export namespace EntityFactory
{
	/**
	 * Initializes a new instance of a concrete {@link Message} subclass, given the input parameters.
	 * @package
	 * */
	export function createMessage(data: MessageData, restClient: RestClient): Message
	{
		switch (data.type)
		{
			case MessageType.Standard:
				return new StandardMessage(data, restClient);
			case MessageType.UserJoin:
				return new UserJoinMessage(data, restClient);
			case MessageType.UserLeave:
				return new UserLeaveMessage(data, restClient);
			default:
				return new Message(data, restClient);
		}
	}

	/**
	 * Initializes a new instance of a concrete {@link Ban} subclass, given the input parameters.
	 * @package
	 * */
	export function createBan(data: BanData, restClient: RestClient): Ban
	{
		switch (data.type)
		{
			case BanType.Id:
				return new UserBan(data, restClient);
			default:
				throw new InvalidOperationError("Unexpected ban type.");
		}
	}

	export function createRoom(data: RoomData, restClient: RestClient): Room
	{
		switch (data.type)
		{
			case RoomType.Text:
				return new TextRoom(data, restClient);
			default:
				return new Room(data, restClient);
		}
	}
}

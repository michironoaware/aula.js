import { SealedClassError } from "../../../Common/SealedClassError";
import { OperationType } from "./OperationType";
import { EventType } from "./EventType";
import { ThrowHelper } from "../../../Common/ThrowHelper";
import { ReadyEventData } from "./ReadyEventData";
import { BanData } from "../../Rest/Entities/Models/BanData";
import { MessageData } from "../../Rest/Entities/Models/MessageData";
import { UserStartedTypingEventData } from "./UserStartedTypingEventData";
import { RoomData } from "../../Rest/Entities/Models/RoomData";
import { UserCurrentRoomUpdatedEventData } from "./UserCurrentRoomUpdatedEventData";
import { UserData } from "../../Rest/Entities/Models/UserData";
import { UserPresenceUpdatedEventData } from "./UserPresenceUpdatedEventData";

/**
 * @sealed
 * */
export class GatewayPayload
{
	readonly #_operation: OperationType;
	readonly #_event: EventType | null;
	readonly #_data: ReadyEventData | BanData | MessageData | UserStartedTypingEventData | RoomData |
	                 UserCurrentRoomUpdatedEventData | UserData | UserPresenceUpdatedEventData | null = null;

	public constructor(payloadData: any)
	{
		SealedClassError.throwIfNotEqual(GatewayPayload, new.target);
		ThrowHelper.TypeError.throwIfNullable(payloadData);
		ThrowHelper.TypeError.throwIfNotType(payloadData.operation, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(payloadData.event, "string", "nullable");

		this.#_operation = payloadData.operation;
		this.#_event = payloadData.event ?? null;

		switch (this.#_operation)
		{
			case OperationType.Dispatch:
			{
				ThrowHelper.TypeError.throwIfNullable(this.#_event);
				ThrowHelper.TypeError.throwIfNullable(payloadData.data);

				switch (this.#_event)
				{
					case EventType.Ready:
						this.#_data = new ReadyEventData(payloadData.data);
						break;
					case EventType.BanIssued:
					case EventType.BanLifted:
						this.#_data = new BanData(payloadData.data);
						break;
					case EventType.MessageCreated:
					case EventType.MessageDeleted:
						this.#_data = new MessageData(payloadData.data);
						break;
					case EventType.UserStartedTyping:
						this.#_data = new UserStartedTypingEventData(payloadData.data);
						break;
					case EventType.RoomCreated:
					case EventType.RoomUpdated:
					case EventType.RoomDeleted:
						this.#_data = new RoomData(payloadData.data);
						break;
					case EventType.UserCurrentRoomUpdated:
						this.#_data = new UserCurrentRoomUpdatedEventData(payloadData.data);
						break;
					case EventType.UserUpdated:
						this.#_data = new UserData(payloadData.data);
						break;
					case EventType.UserPresenceUpdated:
						this.#_data = new UserPresenceUpdatedEventData(payloadData.data);
						break;
					default:
						break;
				}

				break;
			}
			default:
				break;
		}
	}

	public get operation()
	{
		return this.#_operation;
	}

	public get event()
	{
		return this.#_event;
	}

	public get data()
	{
		return this.#_data;
	}
}

import { SealedClassError } from "../../../Common/SealedClassError.js";
import { OperationType } from "./OperationType.js";
import { EventType } from "./EventType.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { ReadyEventData } from "./ReadyEventData.js";
import { BanData } from "../../Rest/Entities/Models/BanData.js";
import { MessageData } from "../../Rest/Entities/Models/MessageData.js";
import { UserTypingEventData } from "./UserTypingEventData.js";
import { RoomConnectionEventData } from "./RoomConnectionEventData.js";
import { RoomData } from "../../Rest/Entities/Models/RoomData.js";
import { UserCurrentRoomUpdatedEventData } from "./UserCurrentRoomUpdatedEventData.js";
import { UserData } from "../../Rest/Entities/Models/UserData.js";

export class GatewayPayload
{
	readonly #_operation: OperationType;
	readonly #_event: keyof typeof EventType | null;
	readonly #_data: ReadyEventData | BanData | MessageData | UserTypingEventData | RoomConnectionEventData | RoomData |
	                 UserCurrentRoomUpdatedEventData | UserData | null = null;

	public constructor(payloadData: any)
	{
		SealedClassError.throwIfNotEqual(GatewayPayload, new.target);
		ThrowHelper.TypeError.throwIfNullable(payloadData);
		ThrowHelper.TypeError.throwIfNotType(payloadData.operation, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(payloadData.event, "string", "null", "undefined");

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
					case EventType[EventType.Ready]:
						this.#_data = new ReadyEventData(payloadData.data);
					case EventType[EventType.BanCreated]:
					case EventType[EventType.BanRemoved]:
						this.#_data = new BanData(payloadData.data);
						break;
					case EventType[EventType.MessageCreated]:
					case EventType[EventType.MessageRemoved]:
						this.#_data = new MessageData(payloadData.data);
						break;
					case EventType[EventType.UserStartedTyping]:
					case EventType[EventType.UserStoppedTyping]:
						this.#_data = new UserTypingEventData(payloadData.data);
						break;
					case EventType[EventType.RoomConnectionCreated]:
					case EventType[EventType.RoomConnectionRemoved]:
						this.#_data = new RoomConnectionEventData(payloadData.data);
						break;
					case EventType[EventType.RoomCreated]:
					case EventType[EventType.RoomUpdated]:
					case EventType[EventType.RoomRemoved]:
						this.#_data = new RoomData(payloadData.data);
						break;
					case EventType[EventType.UserCurrentRoomUpdated]:
						this.#_data = new UserCurrentRoomUpdatedEventData(payloadData.data);
						break;
					case EventType[EventType.UserUpdated]:
						this.#_data = new UserData(payloadData.data);
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

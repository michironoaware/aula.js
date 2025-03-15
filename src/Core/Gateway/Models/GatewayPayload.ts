import { SealedClassError } from "../../../Common/SealedClassError.js";
import { OperationType } from "./OperationType.js";
import { EventType } from "./EventType.js";
import { ThrowHelper } from "../../../Common/ThrowHelper.js";
import { HelloOperationData } from "./HelloOperationData.js";
import { BanData } from "../../Rest/Entities/Models/BanData.js";
import { MessageData } from "../../Rest/Entities/Models/MessageData.js";
import { UserTypingEventData } from "./UserTypingEventData.js";
import { RoomConnectionEventData } from "./RoomConnectionEventData.js";
import { RoomData } from "../../Rest/Entities/Models/RoomData.js";
import { UserCurrentRoomUpdatedEventData } from "./UserCurrentRoomUpdatedEventData.js";
import { UserData } from "../../Rest/Entities/Models/UserData.js";

export class GatewayPayload
{
	readonly #operation: OperationType;
	readonly #event: keyof typeof EventType | null;
	readonly #data: HelloOperationData | BanData | MessageData | UserTypingEventData | RoomConnectionEventData | RoomData |
	                UserCurrentRoomUpdatedEventData | UserData | null = null;

	public constructor(payloadData: any)
	{
		SealedClassError.throwIfNotEqual(GatewayPayload, new.target);
		ThrowHelper.TypeError.throwIfNullable(payloadData);
		ThrowHelper.TypeError.throwIfNotType(payloadData.operation, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(payloadData.event, "string", "null", "undefined");

		this.#operation = payloadData.operation;
		this.#event = payloadData.event ?? null;

		switch (this.#operation)
		{
			case OperationType.Hello:
			{
				ThrowHelper.TypeError.throwIfNullable(payloadData.data);
				this.#data = new HelloOperationData(payloadData.data);
				break;
			}
			case OperationType.Dispatch:
			{
				ThrowHelper.TypeError.throwIfNullable(this.#event);
				ThrowHelper.TypeError.throwIfNullable(payloadData.data);

				switch (this.#event)
				{
					case EventType[EventType.BanCreated]:
					case EventType[EventType.BanRemoved]:
						this.#data = new BanData(payloadData.data);
						break;
					case EventType[EventType.MessageCreated]:
					case EventType[EventType.MessageRemoved]:
						this.#data = new MessageData(payloadData.data);
						break;
					case EventType[EventType.UserStartedTyping]:
					case EventType[EventType.UserStoppedTyping]:
						this.#data = new UserTypingEventData(payloadData.data);
						break;
					case EventType[EventType.RoomConnectionCreated]:
					case EventType[EventType.RoomConnectionRemoved]:
						this.#data = new RoomConnectionEventData(payloadData.data);
						break;
					case EventType[EventType.RoomCreated]:
					case EventType[EventType.RoomUpdated]:
					case EventType[EventType.RoomRemoved]:
						this.#data = new RoomData(payloadData.data);
						break;
					case EventType[EventType.UserCurrentRoomUpdated]:
						this.#data = new UserCurrentRoomUpdatedEventData(payloadData.data);
						break;
					case EventType[EventType.UserUpdated]:
						this.#data = new UserData(payloadData.data);
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
		return this.#operation;
	}

	public get event()
	{
		return this.#event;
	}

	public get data()
	{
		return this.#data;
	}
}

import { RestClient } from "../RestClient";
import { RoomData } from "./Models/RoomData";
import { ThrowHelper } from "../../../Common/ThrowHelper";
import { TypeHelper } from "../../../Common/TypeHelper";
import { RoomType } from "./RoomType";
import { ModifyRoomRequestBody } from "../ModifyRoomRequestBody";
import { CancellationToken } from "../../../Common/Threading/CancellationToken";

/**
 * Represents a room within Aula.
 * A room represents a virtual space, a user can move between rooms and perform room-specific actions while inside.
 * */
export class Room
{
	readonly #_restClient: RestClient;
	readonly #_data: RoomData;
	#_creationDate: Date | null = null;

	/**
	 * Initializes a new instance of {@link Room}.
	 * @param data A DTO containing the entity data.
	 * @param restClient The {@link RestClient} that is initializing this instance.
	 * @package
	 * */
	public constructor(data: RoomData, restClient: RestClient)
	{
		ThrowHelper.TypeError.throwIfNotType(data, RoomData);
		//ThrowHelper.TypeError.throwIfNotType(restClient, RestClient); // Circular dependency problem

		this.#_restClient = restClient;
		this.#_data = data;

		this.restClient.cache?.set(this.id, this);
	}

	/**
	 * Gets the {@link RestClient} that initialized this instance.
	 * */
	public get restClient()
	{
		return this.#_restClient;
	}

	/**
	 * Gets the id of the room.
	 * */
	public get id()
	{
		return this.#_data.id;
	}

	/**
	 * Gets the type of the room.
	 * */
	public get type()
	{
		return this.#_data.type as RoomType;
	}

	/**
	 * Gets the name of the room.
	 * */
	public get name()
	{
		return this.#_data.name;
	}

	/**
	 * Gets the description of the room.
	 * */
	public get description()
	{
		return this.#_data.description;
	}

	/**
	 * Gets whether the room serves as an entry point for users without an established current room.
	 * */
	public get isEntrance()
	{
		return this.#_data.isEntrance;
	}

	/**
	 * Gets the file id of the background audio associated with this room.
	 * */
	public get backgroundAudioId()
	{
		return this.#_data.backgroundAudioId;
	}

	/**
	 * Gets the collection of IDs of users currently in the room.
	 * */
	public get residentIds()
	{
		return this.#_data.residentIds;
	}

	/**
	 * Gets the collection of ids of the rooms that a user can travel to from this room.
	 * */
	public get destinationIds()
	{
		return this.#_data.destinationIds;
	}

	/**
	 * Gets the creation date of the room as a {@link Date} object.
	 * */
	get creationDate()
	{
		return this.#_creationDate ??= new Date(this.#_data.creationDate);
	}

	/**
	 * Modifies the room.
	 * Requires the {@link Permissions.ManageRooms} permission.
	 * Fires a {@link RoomUpdatedEvent} gateway event.
	 * @param body A {@link ModifyRoomRequestBody} containing the properties to modify.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a new, updated {@link Room}.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * @throws {AulaNotFoundError} If the room no longer exists.
	 */
	public async modify(body: ModifyRoomRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		return await this.restClient.modifyRoom(this.id, body, cancellationToken);
	}

	/**
	 * Deletes the room.
	 * Requires the {@link Permissions.ManageRooms} permission.
	 * Fires a {@link RoomDeletedEvent} gateway event.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * */
	public async delete(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return await this.restClient.deleteRoom(this.id, cancellationToken);
	}

	/**
	 * Gets the collection of rooms that a user can travel to from this room.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Room} array.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * @throws {AulaNotFoundError} If the room no longer exists.
	 * */
	public async getDestinations(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return await this.restClient.getRoomDestinations(this.id, cancellationToken);
	}

	/**
	 * Adds a room to the collection of rooms that a user can travel to from this room.
	 * Requires the {@link Permissions.ManageRooms} permission.
	 * Fires a {@link RoomUpdatedEvent} gateway event.
	 * @param room The id of the room to add to the collection.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * @throws {AulaNotFoundError} If the room no longer exists.
	 * */
	public async addDestination(room: Room | string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(room, Room, "string");

		const roomId = TypeHelper.isType(room, Room) ? room.id : room;
		return await this.restClient.addRoomDestination(this.id, roomId, cancellationToken);
	}

	/**
	 * Removes a room to the collection of rooms that a user can travel to from this room.
	 * Requires the {@link Permissions.ManageRooms} permission.
	 * Fires a {@link RoomUpdatedEvent} gateway event.
	 * @param room The id of the room to remove from the collection.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * */
	public async removeDestination(room: Room | string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(room, Room, "string");

		const roomId = TypeHelper.isType(room, Room) ? room.id : room;
		return await this.restClient.removeRoomDestination(this.id, roomId, cancellationToken);
	}

	/**
	 * Gets the collection of users that are currently located in the room.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link User} array.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * @throws {AulaNotFoundError} If the room no longer exists.
	 * */
	public async getResidents(cancellationToken: CancellationToken = CancellationToken.none)
	{
		return await this.restClient.getRoomResidents(this.id, cancellationToken);
	}
}

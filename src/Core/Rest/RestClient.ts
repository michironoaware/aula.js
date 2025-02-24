import {HttpClient} from "../../Common/Http/HttpClient.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";
import {HttpResponseMessage} from "../../Common/Http/HttpResponseMessage.js";
import {HttpRequestError} from "../../Common/Http/HttpRequestError.js";
import {HttpStatusCode} from "../../Common/Http/HttpStatusCode.js";
import {AulaUnauthorizedError} from "./AulaUnauthorizedError.js";
import {AulaForbiddenError} from "./AulaForbiddenError.js";
import {AulaBadRequestError} from "./AulaBadRequestError.js";
import {HttpMethod} from "../../Common/Http/HttpMethod.js";
import {HttpRequestMessage} from "../../Common/Http/HttpRequestMessage.js";
import {AulaRoute} from "../AulaRoute.js";
import {User} from "../Entities/User.js";
import {IGetUsersQuery} from "./IGetUsersQuery.js";
import {UserData} from "../Entities/Models/UserData.js";
import {IModifyCurrentUserRequestBody} from "./IModifyCurrentUserRequestBody.js";
import {StringContent} from "../../Common/Http/StringContent.js";
import {UserType} from "../Entities/UserType.js";
import {ISetUserRoomRequestBody} from "./ISetUserRoomRequestBody.js";
import {ISetUserPermissionsRequestBody} from "./ISetUserPermissionsRequestBody.js";
import {ICreateRoomRequestBody} from "./ICreateRoomRequestBody.js";
import {RoomData} from "../Entities/Models/RoomData.js";
import {Room} from "../Entities/Room.js";
import {IGetRoomsQuery} from "./IGetRoomsQuery.js";
import {IModifyRoomRequestBody} from "./IModifyRoomRequestBody.js";
import {ISetRoomConnectionsRequestBody} from "./ISetRoomConnectionsRequestBody.js";

export class RestClient
{
	readonly #httpClient: HttpClient;

	public constructor(httpClient: HttpClient = new HttpClient())
	{
		ThrowHelper.TypeError.throwIfNotType(httpClient, HttpClient);

		this.#httpClient = httpClient;
	}


	static async #ensureSuccessStatusCode(response: HttpResponseMessage): Promise<void>
	{
		ThrowHelper.TypeError.throwIfNotType(response, HttpResponseMessage);

		try
		{
			response.ensureSuccessStatusCode();
		}
		catch (error)
		{
			if (!(error instanceof HttpRequestError))
			{
				return;
			}

			const content = await response.content.readAsString();
			switch (response.statusCode)
			{
				case HttpStatusCode.Unauthorized:
					throw new AulaUnauthorizedError(content);
				case HttpStatusCode.Forbidden:
					throw new AulaForbiddenError(content);
				case HttpStatusCode.BadRequest:
					throw new AulaBadRequestError(content);
				default:
					throw error;
			}
		}
	}

	public setBaseUri(uri: URL)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(uri, URL);
		this.#httpClient.baseUri = uri;
		return this;
	}

	public setToken(value: string)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "string");
		this.#httpClient.defaultRequestHeaders.delete("Authorization");
		this.#httpClient.defaultRequestHeaders.append("Authorization", `Bearer ${value}`);
		return this;
	}

	public async getCurrentUser(): Promise<User>
	{
		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.currentUser());

		const response = await this.#httpClient.Send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		const userData = new UserData(JSON.parse(await response.content.readAsString()));
		return new User(this, userData);
	}

	public async getUsers(query: IGetUsersQuery = {})
	{
		ThrowHelper.TypeError.throwIfNull(query);
		ThrowHelper.TypeError.throwIfNotAnyType(query.type, UserType, "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(query.count, "number", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(query.after, "string", "undefined");

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.users(
			{
				query:
					{
						type: query.type,
						count: query.count,
						after: query.after,
					}
			}
		));

		const response = await this.#httpClient.Send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
			.map((d: any) => new UserData(d))
			.map((d: UserData) => new User(this, d)) as User[];
	}

	public async getUser(userId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.user({ route: { userId } }));

		const response = await this.#httpClient.Send(request);
		if (response.statusCode === HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		const userData = new UserData(JSON.parse(await response.content.readAsString()));
		return new User(this, userData);
	}

	public async modifyCurrentUser(userId: string, body: IModifyCurrentUserRequestBody)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNull(body);
		ThrowHelper.TypeError.throwIfNotAnyType(body.displayName, "string", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(body.description, "string", "undefined");

		const request = new HttpRequestMessage(HttpMethod.Patch, AulaRoute.user({ route: { userId } }));
		request.content = new StringContent(JSON.stringify({
			displayName: body.displayName,
			description: body.description,
		} as IModifyCurrentUserRequestBody));

		const response = await this.#httpClient.Send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		const userData = new UserData(JSON.parse(await response.content.readAsString()));
		return new User(this, userData);
	}

	public async setCurrentUserRoom(body: ISetUserRoomRequestBody)
	{
		ThrowHelper.TypeError.throwIfNull(body);
		ThrowHelper.TypeError.throwIfNotType(body.roomId, "string");

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.currentUserRoom());
		request.content = new StringContent(JSON.stringify({
			roomId: body.roomId,
		} as ISetUserRoomRequestBody));

		const response = await this.#httpClient.Send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async setUserRoom(userId: string, body: ISetUserRoomRequestBody)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNull(body);
		ThrowHelper.TypeError.throwIfNotType(body.roomId, "string");

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.userRoom({ route: { userId } }));
		request.content = new StringContent(JSON.stringify(
		{
			roomId: body.roomId,
		} as ISetUserRoomRequestBody));

		const response = await this.#httpClient.Send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async setUserPermissions(userId: string, body: ISetUserPermissionsRequestBody)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNull(body);
		ThrowHelper.TypeError.throwIfNotType(body.permissions, "number");

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.userPermissions({ route: { userId } }));
		request.content = new StringContent(JSON.stringify({
			permissions: body.permissions,
		} as ISetUserPermissionsRequestBody));

		const response = await this.#httpClient.Send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async createRoom(body: ICreateRoomRequestBody)
	{
		ThrowHelper.TypeError.throwIfNull(body);
		ThrowHelper.TypeError.throwIfNotAnyType(body.name, "string", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(body.description, "string", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(body.isEntrance, "boolean", "undefined");

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.rooms());
		request.content = new StringContent(JSON.stringify({
			name: body.name,
			description: body.description,
			isEntrance: body.isEntrance,
		} as ICreateRoomRequestBody));

		const response = await this.#httpClient.Send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		const roomData = new RoomData(JSON.parse(await response.content.readAsString()));
		return new Room(this, roomData);
	}

	public async getRooms(query: IGetRoomsQuery = {})
	{
		ThrowHelper.TypeError.throwIfNull(query);
		ThrowHelper.TypeError.throwIfNotAnyType(query.count, "number", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(query.after, "string", "undefined");

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.rooms(
			{
				query:
					{
						count: query.count,
						after: query.after,
					}
			}
		));

		const response = await this.#httpClient.Send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
			.map((d: any) => new RoomData(d))
			.map((d: RoomData) => new Room(this, d)) as Room[];
	}

	public async getRoom(roomId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.room({ route: { roomId }}));

		const response = await this.#httpClient.Send(request);
		if (response.statusCode === HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		const roomData = new RoomData(JSON.parse(await response.content.readAsString()));
		return new Room(this, roomData);
	}

	public async modifyRoom(roomId: string, body: IModifyRoomRequestBody)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNull(body);
		ThrowHelper.TypeError.throwIfNotAnyType(body.name, "string", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(body.description, "string", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(body.isEntrance, "boolean", "undefined");

		const request = new HttpRequestMessage(HttpMethod.Patch, AulaRoute.room({ route: { roomId }}));
		request.content = new StringContent(JSON.stringify({
			name: body.name,
			description: body.description,
			isEntrance: body.isEntrance,
		} as IModifyRoomRequestBody));

		const response = await this.#httpClient.Send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		const roomData = new RoomData(JSON.parse(await response.content.readAsString()));
		return new Room(this, roomData);
	}

	public async removeRoom(roomId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.room({ route: { roomId }}));

		const response = await this.#httpClient.Send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async addRoomConnection(roomId: string, targetId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(targetId, "string");

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.roomConnection({ route: { roomId, targetId }}));

		const response = await this.#httpClient.Send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async getRoomConnections(roomId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomConnections({ route: { roomId }}));

		const response = await this.#httpClient.Send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse((await response.content.readAsString()))
			.map((d: any)=> new RoomData(d))
			.map((d: RoomData) => new Room(this, d)) as Room[];
	}

	public async setRoomConnections(roomId: string, body: ISetRoomConnectionsRequestBody)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNull(body);
		ThrowHelper.TypeError.throwIfNotType(body.roomIds, Array<string>);
		for (const id of body.roomIds)
		{
			ThrowHelper.TypeError.throwIfNotAnyType(id, "string");
		}

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.roomConnections({ route: { roomId }}));

		const response = await this.#httpClient.Send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async removeRoomConnection(roomId: string, targetId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(targetId, "string");

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.roomConnection({ route: { roomId, targetId }}));

		const response = await this.#httpClient.Send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async startTyping(roomId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.startTyping({ route: { roomId }}));

		const response = await this.#httpClient.Send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}
}

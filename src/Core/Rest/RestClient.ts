import {HttpClient} from "../../Common/Http/HttpClient.js";
import {ThrowHelper} from "../../Common/ThrowHelper.js";
import {HttpResponseMessage} from "../../Common/Http/HttpResponseMessage.js";
import {HttpRequestError} from "../../Common/Http/HttpRequestError.js";
import {HttpStatusCode} from "../../Common/Http/HttpStatusCode.js";
import {AulaUnauthorizedError} from "./AulaUnauthorizedError.js";
import {AulaForbiddenError} from "./AulaForbiddenError.js";
import {AulaBadRequestError} from "./AulaBadRequestError.js";
import {AulaNotFoundError} from "./AulaNotFoundError.js";
import {HttpMethod} from "../../Common/Http/HttpMethod.js";
import {HttpRequestMessage} from "../../Common/Http/HttpRequestMessage.js";
import {AulaRoute} from "../AulaRoute.js";
import {User} from "../Entities/User.js";
import {IGetUsersQuery} from "./IGetUsersQuery.js";
import {UserData} from "../Entities/Models/UserData.js";
import {IModifyCurrentUserRequestBody} from "./IModifyCurrentUserRequestBody.js";
import {JsonContent} from "../../Common/Http/JsonContent.js";
import {UserType} from "../Entities/UserType.js";
import {ISetUserRoomRequestBody} from "./ISetUserRoomRequestBody.js";
import {ISetUserPermissionsRequestBody} from "./ISetUserPermissionsRequestBody.js";
import {ICreateRoomRequestBody} from "./ICreateRoomRequestBody.js";
import {RoomData} from "../Entities/Models/RoomData.js";
import {Room} from "../Entities/Room.js";
import {IGetRoomsQuery} from "./IGetRoomsQuery.js";
import {IModifyRoomRequestBody} from "./IModifyRoomRequestBody.js";
import {ISetRoomConnectionsRequestBody} from "./ISetRoomConnectionsRequestBody.js";
import {MessageData} from "../Entities/Models/MessageData.js";
import {Message} from "../Entities/Message.js";
import {IGetMessagesQuery} from "./IGetMessagesQuery.js";
import {MessageType} from "../Entities/MessageType.js";
import {ISendMessageRequestBody} from "./ISendMessageRequestBody.js";
import {ISendUnknownMessageRequestBody} from "./ISendUnknownMessageRequestBody.js";
import {IConfirmEmailQuery} from "./IConfirmEmailQuery.js";
import {IForgotPasswordQuery} from "./IForgotPasswordQuery.js";
import {IResetPasswordRequestBody} from "./IResetPasswordRequestBody.js";
import {IRegisterRequestBody} from "./IRegisterRequestBody.js";
import {ILogInRequestBody} from "./ILogInRequestBody.js";
import {LogInResponse} from "./LogInResponse.js";
import {ICreateBotRequestBody} from "./ICreateBotRequestBody.js";
import {CreateBotResponse} from "./CreateBotResponse.js";
import {ResetBotTokenResponse} from "./ResetBotTokenResponse.js";
import {IBanUserRequestBody} from "./IBanUserRequestBody.js";
import {BanData} from "../Entities/Models/BanData.js";
import {Ban} from "../Entities/Ban.js";
import {GetCurrentUserBanStatusResponse} from "./GetCurrentUserBanStatusResponse.js";
import {SealedClassError} from "../../Common/SealedClassError.js";
import {AulaGlobalRateLimiterHandler} from "./AulaGlobalRateLimiterHandler.js";
import {HttpFetchHandler} from "../../Common/Http/HttpFetchHandler.js";
import {AulaRestError} from "../AulaRestError.js";
import {AulaRouteRateLimiterHandler} from "./AulaRouteRateLimiterHandler.js";

export class RestClient
{
	readonly #httpClient: HttpClient;

	public constructor(options: { httpClient?: HttpClient } = {})
	{
		SealedClassError.throwIfNotEqual(RestClient, new.target);
		ThrowHelper.TypeError.throwIfNullable(options);
		ThrowHelper.TypeError.throwIfNotAnyType(options.httpClient, HttpClient, "undefined");

		this.#httpClient = options.httpClient ?? new HttpClient({
			handler: new AulaGlobalRateLimiterHandler(
				new AulaRouteRateLimiterHandler(
				new HttpFetchHandler(), true))
		});
	}

	static async #ensureSuccessStatusCode(response: HttpResponseMessage)
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
					throw new AulaUnauthorizedError(content, error);
				case HttpStatusCode.Forbidden:
					throw new AulaForbiddenError(content, error);
				case HttpStatusCode.BadRequest:
					throw new AulaBadRequestError(content, error);
				case HttpStatusCode.NotFound:
					throw new AulaNotFoundError(content, error);
				default:
					throw new AulaRestError(error.message, content, error);
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

	public async getCurrentUser()
	{
		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.currentUser());

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		const userData = new UserData(JSON.parse(await response.content.readAsString()));
		return new User(this, userData);
	}

	public async getUsers(query: IGetUsersQuery = {})
	{
		ThrowHelper.TypeError.throwIfNullable(query);
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

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
			.map((d: any) => new UserData(d))
			.map((d: UserData) => new User(this, d)) as User[];
	}

	public async getUser(userId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.user({ route: { userId } }));

		const response = await this.#httpClient.send(request);
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
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotAnyType(body.displayName, "string", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(body.description, "string", "undefined");

		const request = new HttpRequestMessage(HttpMethod.Patch, AulaRoute.user({ route: { userId } }));
		request.content = new JsonContent(
			{
				displayName: body.displayName,
				description: body.description,
			} as IModifyCurrentUserRequestBody);

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		const userData = new UserData(JSON.parse(await response.content.readAsString()));
		return new User(this, userData);
	}

	public async setCurrentUserRoom(body: ISetUserRoomRequestBody)
	{
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.roomId, "string");

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.currentUserRoom());
		request.content = new JsonContent(
			{
				roomId: body.roomId,
			} as ISetUserRoomRequestBody);

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async setUserRoom(userId: string, body: ISetUserRoomRequestBody)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.roomId, "string");

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.userRoom({ route: { userId } }));
		request.content = new JsonContent(
			{
				roomId: body.roomId,
			} as ISetUserRoomRequestBody);

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async setUserPermissions(userId: string, body: ISetUserPermissionsRequestBody)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.permissions, "number");

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.userPermissions({ route: { userId } }));
		request.content = new JsonContent(
			{
				permissions: body.permissions,
			} as ISetUserPermissionsRequestBody);

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async createRoom(body: ICreateRoomRequestBody)
	{
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotAnyType(body.name, "string", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(body.description, "string", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(body.isEntrance, "boolean", "undefined");

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.rooms());
		request.content = new JsonContent(
			{
				name: body.name,
				description: body.description,
				isEntrance: body.isEntrance,
			} as ICreateRoomRequestBody);

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		const roomData = new RoomData(JSON.parse(await response.content.readAsString()));
		return new Room(this, roomData);
	}

	public async getRooms(query: IGetRoomsQuery = {})
	{
		ThrowHelper.TypeError.throwIfNullable(query);
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

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
			.map((d: any) => new RoomData(d))
			.map((d: RoomData) => new Room(this, d)) as Room[];
	}

	public async getRoom(roomId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.room({ route: { roomId }}));

		const response = await this.#httpClient.send(request);
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
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotAnyType(body.name, "string", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(body.description, "string", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(body.isEntrance, "boolean", "undefined");

		const request = new HttpRequestMessage(HttpMethod.Patch, AulaRoute.room({ route: { roomId }}));
		request.content = new JsonContent(
			{
				name: body.name,
				description: body.description,
				isEntrance: body.isEntrance,
			} as IModifyRoomRequestBody);

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		const roomData = new RoomData(JSON.parse(await response.content.readAsString()));
		return new Room(this, roomData);
	}

	public async removeRoom(roomId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.room({ route: { roomId } }));

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async addRoomConnection(roomId: string, targetId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(targetId, "string");

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.roomConnection({ route: { roomId, targetId }}));

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async getRoomConnections(roomId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomConnections({ route: { roomId }}));

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse((await response.content.readAsString()))
			.map((d: any)=> new RoomData(d))
			.map((d: RoomData) => new Room(this, d)) as Room[];
	}

	public async setRoomConnections(roomId: string, body: ISetRoomConnectionsRequestBody)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.roomIds, "iterable");

		const roomIds = [...body.roomIds];
		for (const roomId of roomIds)
		{
			ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		}

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.roomConnections({ route: { roomId }}));
		request.content = new JsonContent({ roomIds } as ISetRoomConnectionsRequestBody);

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async removeRoomConnection(roomId: string, targetId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(targetId, "string");

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.roomConnection({ route: { roomId, targetId }}));

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async getRoomUsers(roomId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomUsers({ route: { roomId }}));

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
			.map((d: any) => new UserData(d))
			.map((d: UserData) => new User(this, d)) as User[];
	}

	public async startTyping(roomId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.startTyping({ route: { roomId }}));

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async stopTyping(roomId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.stopTyping({ route: { roomId }}));

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async sendMessage(roomId: string, body: ISendMessageRequestBody)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.type, MessageType);
		ThrowHelper.TypeError.throwIfNotAnyType(body.flags, "number", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType((body as ISendUnknownMessageRequestBody).content, "string", "undefined");

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.roomMessages({ route: { roomId }}));
		request.content = new JsonContent(
			{
				type: body.type,
				flags: body.flags,
				content: body.content,
			} as ISendUnknownMessageRequestBody);

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		const messageData = new MessageData(JSON.parse(await response.content.readAsString()));
		return new Message(this, messageData);
	}

	public async getMessage(roomId: string, messageId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(messageId, "string");

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomMessage({ route: { roomId, messageId }}));

		const response = await this.#httpClient.send(request);
		if (response.statusCode === HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		const messageData = new MessageData(JSON.parse((await response.content.readAsString())));
		return new Message(this, messageData);
	}

	public async getMessages(roomId: string, query: IGetMessagesQuery = {})
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNullable(query);
		ThrowHelper.TypeError.throwIfNotAnyType(query.after, "string", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(query.before, "string", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(query.count, "number", "undefined");

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomMessages(
			{
				route: { roomId },
				query:
					{
						after: query.after,
						before: query.before,
						count: query.count,
					}
			}
		));

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse((await response.content.readAsString()))
			.map((d: any) => new MessageData(d))
			.map((d: MessageData) => new Message(this, d)) as Message[];
	}

	public async removeMessage(roomId: string, messageId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(messageId, "string");

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.roomMessage({ route: { roomId, messageId }}));

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async register(body: IRegisterRequestBody)
	{
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.userName, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(body.displayName, "string", "undefined");
		ThrowHelper.TypeError.throwIfNotType(body.email, "string");
		ThrowHelper.TypeError.throwIfNotType(body.password, "string");

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.register());
		request.content = new JsonContent(
			{
				userName: body.userName,
				displayName: body.displayName,
				email: body.email,
				password: body.password,
			} as IRegisterRequestBody);

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async logIn(body: ILogInRequestBody)
	{
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.userName, "string");
		ThrowHelper.TypeError.throwIfNotType(body.password, "string");

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.logIn());
		request.content = new JsonContent(
			{
				userName: body.userName,
				password: body.password,
			} as ILogInRequestBody);

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return new LogInResponse(JSON.parse(await response.content.readAsString()));
	}

	public async confirmEmail(query: IConfirmEmailQuery)
	{
		ThrowHelper.TypeError.throwIfNullable(query);
		ThrowHelper.TypeError.throwIfNotType(query.email, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(query.token, "string", "undefined");

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.confirmEmail(
			{
				query:
					{
						email: query.email,
						token: query.token,
					}
			}));

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async forgotPassword(query: IForgotPasswordQuery)
	{
		ThrowHelper.TypeError.throwIfNullable(query);
		ThrowHelper.TypeError.throwIfNotType(query.email, "string");

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.forgotPassword({ query: { email: query.email } }));

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async resetPassword(body: IResetPasswordRequestBody)
	{
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.code, "string");
		ThrowHelper.TypeError.throwIfNotType(body.newPassword, "string");

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.resetPassword());
		request.content = new JsonContent(
			{
				code: body.code,
				newPassword: body.newPassword,
			} as IResetPasswordRequestBody);

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async resetToken(body: ILogInRequestBody)
	{
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.userName, "string");
		ThrowHelper.TypeError.throwIfNotType(body.password, "string");

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.resetToken());
		request.content = new JsonContent(
			{
				userName: body.userName,
				password: body.password,
			} as ILogInRequestBody);

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async createBot(body: ICreateBotRequestBody)
	{
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.displayName, "string");

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.bots());
		request.content = new JsonContent(
			{
				displayName: body.displayName,
			} as ICreateBotRequestBody);

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return new CreateBotResponse(JSON.parse(await response.content.readAsString()), this);
	}

	public async removeBot(userId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.bot({ route: { userId } }));

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async resetBotToken(userId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.resetBotToken({ route: { userId } }));

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return new ResetBotTokenResponse(JSON.parse(await response.content.readAsString()));
	}

	public async banUser(userId: string, body: IBanUserRequestBody = {})
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotAnyType(body.reason, "string", "undefined");

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.userBan({ route: { userId } }));
		request.content = new JsonContent(
			{
				reason: body.reason,
			} as IBanUserRequestBody);

		const response = await this.#httpClient.send(request);
		if (response.statusCode === HttpStatusCode.Conflict)
		{
			// Instead of throwing, return null if the ban already exists.
			return null;
		}
		await RestClient.#ensureSuccessStatusCode(response);

		const banData = new BanData(JSON.parse(await response.content.readAsString()));
		return new Ban(this, banData);
	}

	public async unbanUser(userId: string)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.userBan({ route: { userId } }));

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async getCurrentUserBanStatus()
	{
		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.currentUserBanStatus());

		const response = await this.#httpClient.send(request);
		await RestClient.#ensureSuccessStatusCode(response);

		return new GetCurrentUserBanStatusResponse(JSON.parse(await response.content.readAsString()));
	}
}

import { HttpClient } from "../../Common/Http/HttpClient.js";
import { ThrowHelper } from "../../Common/ThrowHelper.js";
import { HttpResponseMessage } from "../../Common/Http/HttpResponseMessage.js";
import { HttpRequestError } from "../../Common/Http/HttpRequestError.js";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode.js";
import { AulaUnauthorizedError } from "./AulaUnauthorizedError.js";
import { AulaForbiddenError } from "./AulaForbiddenError.js";
import { AulaBadRequestError } from "./AulaBadRequestError.js";
import { AulaNotFoundError } from "./AulaNotFoundError.js";
import { HttpMethod } from "../../Common/Http/HttpMethod.js";
import { HttpRequestMessage } from "../../Common/Http/HttpRequestMessage.js";
import { AulaRoute } from "../AulaRoute.js";
import { User } from "./Entities/User.js";
import { IGetUsersQuery } from "./IGetUsersQuery.js";
import { UserData } from "./Entities/Models/UserData.js";
import { IModifyCurrentUserRequestBody } from "./IModifyCurrentUserRequestBody.js";
import { JsonContent } from "../../Common/Http/JsonContent.js";
import { ISetUserRoomRequestBody } from "./ISetUserRoomRequestBody.js";
import { ISetUserPermissionsRequestBody } from "./ISetUserPermissionsRequestBody.js";
import { ICreateRoomRequestBody } from "./ICreateRoomRequestBody.js";
import { RoomData } from "./Entities/Models/RoomData.js";
import { Room } from "./Entities/Room.js";
import { IGetRoomsQuery } from "./IGetRoomsQuery.js";
import { IModifyRoomRequestBody } from "./IModifyRoomRequestBody.js";
import { ISetRoomConnectionsRequestBody } from "./ISetRoomConnectionsRequestBody.js";
import { MessageData } from "./Entities/Models/MessageData.js";
import { Message } from "./Entities/Message.js";
import { IGetMessagesQuery } from "./IGetMessagesQuery.js";
import { MessageType } from "./Entities/MessageType.js";
import { ISendMessageRequestBody } from "./ISendMessageRequestBody.js";
import { ISendUnknownMessageRequestBody } from "./ISendUnknownMessageRequestBody.js";
import { IConfirmEmailQuery } from "./IConfirmEmailQuery.js";
import { IForgotPasswordQuery } from "./IForgotPasswordQuery.js";
import { IResetPasswordRequestBody } from "./IResetPasswordRequestBody.js";
import { IRegisterRequestBody } from "./IRegisterRequestBody.js";
import { ILogInRequestBody } from "./ILogInRequestBody.js";
import { LogInResponse } from "./LogInResponse.js";
import { ICreateBotRequestBody } from "./ICreateBotRequestBody.js";
import { CreateBotResponse } from "./CreateBotResponse.js";
import { ResetBotTokenResponse } from "./ResetBotTokenResponse.js";
import { IBanUserRequestBody } from "./IBanUserRequestBody.js";
import { BanData } from "./Entities/Models/BanData.js";
import { Ban } from "./Entities/Ban.js";
import { GetCurrentUserBanStatusResponse } from "./GetCurrentUserBanStatusResponse.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { AulaGlobalRateLimiterHandler } from "./AulaGlobalRateLimiterHandler.js";
import { HttpFetchHandler } from "./HttpFetchHandler.js";
import { AulaRestError } from "./AulaRestError.js";
import { AulaRouteRateLimiterHandler } from "./AulaRouteRateLimiterHandler.js";
import { AulaHttpStatusCode503Handler } from "./AulaHttpStatusCode503Handler.js";
import { IGetBansQuery } from "./IGetBansQuery.js";
import { UserBan } from "./Entities/UserBan.js";
import { EntityFactory } from "./Entities/EntityFactory.js";
import { ProblemDetails } from "./Entities/Models/ProblemDetails.js";
import { FileData } from "./Entities/Models/FileData.js";
import { File } from "./Entities/File.js";
import { FileContent } from "./Entities/FileContent.js";
import { MultipartFormDataContent } from "../../Common/Http/MultipartFormDataContent.js";
import { ByteArrayContent } from "../../Common/Http/ByteArrayContent.js";
import { IGetFilesQuery } from "./IGetFilesQuery.js";
import { CancellationToken } from "../../Common/Threading/CancellationToken.js";
import { IDisposable } from "../../Common/IDisposable.js";
import { ObjectDisposedError } from "../../Common/ObjectDisposedError.js";

export class RestClient implements IDisposable
{
	readonly #_httpClient: HttpClient;
	readonly #_disposeHttpClient: boolean;
	#_disposed: boolean = false;

	public constructor(options: { httpClient?: HttpClient, disposeHttpClient?: boolean } = {})
	{
		SealedClassError.throwIfNotEqual(RestClient, new.target);
		ThrowHelper.TypeError.throwIfNullable(options);
		ThrowHelper.TypeError.throwIfNotAnyType(options.httpClient, HttpClient, "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(options.disposeHttpClient, "boolean", "undefined");

		this.#_httpClient = options.httpClient ?? new HttpClient(
			new AulaHttpStatusCode503Handler(
				new AulaGlobalRateLimiterHandler(
					new AulaRouteRateLimiterHandler(
						new HttpFetchHandler(), true, true), true), true), true);

		this.#_disposeHttpClient = options.disposeHttpClient ?? (options.httpClient === undefined);
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
				throw error;
			}

			const problemDetails = new ProblemDetails(JSON.parse(await response.content.readAsString()));
			switch (response.statusCode)
			{
				case HttpStatusCode.Unauthorized:
					throw new AulaUnauthorizedError(problemDetails, error);
				case HttpStatusCode.Forbidden:
					throw new AulaForbiddenError(problemDetails, error);
				case HttpStatusCode.BadRequest:
					throw new AulaBadRequestError(problemDetails, error);
				case HttpStatusCode.NotFound:
					throw new AulaNotFoundError(problemDetails, error);
				default:
					throw new AulaRestError(error.message, problemDetails, error);
			}
		}
	}

	public setBaseAddress(uri: URL)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(uri, URL);
		ObjectDisposedError.throwIf(this.#_disposed);

		this.#_httpClient.baseAddress = new URL(`${uri.href}${uri.href.endsWith("/") ? "" : "/"}api/v1/`);
		return this;
	}

	public setToken(value: string)
	{
		ThrowHelper.TypeError.throwIfNotType(value, "string");
		ObjectDisposedError.throwIf(this.#_disposed);

		this.#_httpClient.defaultRequestHeaders.delete("Authorization");
		this.#_httpClient.defaultRequestHeaders.add("Authorization", `Bearer ${value}`);
		return this;
	}

	public dispose()
	{
		if (this.#_disposed)
		{
			return;
		}

		if (this.#_disposeHttpClient)
		{
			this.#_httpClient.dispose();
		}

		this.#_disposed = true;
	}

	public async getCurrentUser(cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.currentUser());

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new User(new UserData(JSON.parse(await response.content.readAsString())), this);
	}

	public async getUsers(query: IGetUsersQuery = {}, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNullable(query);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.users({ query }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
		           .map((d: any) => new User(new UserData(d), this)) as User[];
	}

	public async getUser(userId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.user({ route: { userId } }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode === HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		return new User(new UserData(JSON.parse(await response.content.readAsString())), this);
	}

	public async modifyCurrentUser(body: IModifyCurrentUserRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotAnyType(body.displayName, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotAnyType(body.description, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Patch, AulaRoute.currentUser());
		request.content = new JsonContent(
			{
				displayName: body.displayName,
				description: body.description,
			} as IModifyCurrentUserRequestBody);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new User(new UserData(JSON.parse(await response.content.readAsString())), this);
	}

	public async setCurrentUserRoom(body: ISetUserRoomRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.currentUserRoom());
		request.content = new JsonContent(
			{
				roomId: body.roomId,
			} as ISetUserRoomRequestBody);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async setUserRoom(userId: string, body: ISetUserRoomRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotAnyType(body.roomId, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.userRoom({ route: { userId } }));
		request.content = new JsonContent(
			{
				roomId: body.roomId,
			} as ISetUserRoomRequestBody);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async setUserPermissions(
		userId: string,
		body: ISetUserPermissionsRequestBody,
		cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.permissions, "number");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.userPermissions({ route: { userId } }));
		request.content = new JsonContent(
			{
				permissions: body.permissions,
			} as ISetUserPermissionsRequestBody);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async createRoom(body: ICreateRoomRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.type, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(body.name, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(body.description, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(body.isEntrance, "boolean", "nullable");
		ThrowHelper.TypeError.throwIfNotAnyType(body.backgroundAudioId, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.rooms());
		request.content = new JsonContent(
			{
				type: body.type,
				name: body.name,
				description: body.description,
				isEntrance: body.isEntrance,
				backgroundAudioId: body.backgroundAudioId,
			} as ICreateRoomRequestBody);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createRoom(new RoomData(JSON.parse(await response.content.readAsString())), this);
	}

	public async getRooms(query: IGetRoomsQuery = {}, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNullable(query);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.rooms({ query }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
		           .map((d: any) => EntityFactory.createRoom(new RoomData(d), this)) as Room[];
	}

	public async getRoom(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.room({ route: { roomId } }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode === HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createRoom(new RoomData(JSON.parse(await response.content.readAsString())), this);
	}

	public async modifyRoom(roomId: string, body: IModifyRoomRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotAnyType(body.name, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotAnyType(body.description, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotAnyType(body.isEntrance, "boolean", "nullable");
		ThrowHelper.TypeError.throwIfNotAnyType(body.backgroundAudioId, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Patch, AulaRoute.room({ route: { roomId } }));
		request.content = new JsonContent(
			{
				name: body.name,
				description: body.description,
				isEntrance: body.isEntrance,
				backgroundAudioId: body.backgroundAudioId,
			} as IModifyRoomRequestBody);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createRoom(new RoomData(JSON.parse(await response.content.readAsString())), this);
	}

	public async removeRoom(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.room({ route: { roomId } }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async addRoomConnection(roomId: string, targetId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(targetId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.roomConnection({ route: { roomId, targetId } }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async getRoomConnections(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomConnections({ route: { roomId } }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse((await response.content.readAsString()))
		           .map((d: any) => EntityFactory.createRoom(new RoomData(d), this)) as Room[];
	}

	public async setRoomConnections(
		roomId: string,
		body: ISetRoomConnectionsRequestBody,
		cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.roomIds, "iterable");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const roomIds = [ ...body.roomIds ];
		for (const roomId of roomIds)
		{
			ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		}

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.roomConnections({ route: { roomId } }));
		request.content = new JsonContent({ roomIds } as ISetRoomConnectionsRequestBody);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async removeRoomConnection(roomId: string, targetId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(targetId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.roomConnection({ route: { roomId, targetId } }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async getRoomUsers(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomUsers({ route: { roomId } }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
		           .map((d: any) => new User(new UserData(d), this)) as User[];
	}

	public async startTyping(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.startTyping({ route: { roomId } }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async stopTyping(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.stopTyping({ route: { roomId } }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async sendMessage(roomId: string, body: ISendMessageRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.type, MessageType);
		ThrowHelper.TypeError.throwIfNotAnyType(body.flags, "number", "nullable");
		ThrowHelper.TypeError.throwIfNotAnyType((body as ISendUnknownMessageRequestBody).content, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.roomMessages({ route: { roomId } }));
		request.content = new JsonContent(
			{
				type: body.type,
				flags: body.flags,
				content: body.content,
			} as ISendUnknownMessageRequestBody);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createMessage(new MessageData(JSON.parse(await response.content.readAsString())), this);
	}

	public async getMessage(roomId: string, messageId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(messageId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomMessage({ route: { roomId, messageId } }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode === HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createMessage(new MessageData(JSON.parse((await response.content.readAsString()))), this);
	}

	public async getMessages(roomId: string, query: IGetMessagesQuery = {}, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomMessages({ route: { roomId }, query }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse((await response.content.readAsString()))
		           .map((d: any) => EntityFactory.createMessage(new MessageData(d), this)) as Message[];
	}

	public async removeMessage(roomId: string, messageId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(messageId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.roomMessage({ route: { roomId, messageId } }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async register(body: IRegisterRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.userName, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(body.displayName, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotType(body.email, "string");
		ThrowHelper.TypeError.throwIfNotType(body.password, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.register());
		request.content = new JsonContent(
			{
				userName: body.userName,
				displayName: body.displayName,
				email: body.email,
				password: body.password,
			} as IRegisterRequestBody);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async logIn(body: ILogInRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.userName, "string");
		ThrowHelper.TypeError.throwIfNotType(body.password, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.logIn());
		request.content = new JsonContent(
			{
				userName: body.userName,
				password: body.password,
			} as ILogInRequestBody);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new LogInResponse(JSON.parse(await response.content.readAsString()), this);
	}

	public async confirmEmail(query: IConfirmEmailQuery, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNullable(query);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.confirmEmail({ query }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async forgotPassword(query: IForgotPasswordQuery, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNullable(query);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.forgotPassword({ query }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async resetPassword(body: IResetPasswordRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.code, "string");
		ThrowHelper.TypeError.throwIfNotType(body.newPassword, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.resetPassword());
		request.content = new JsonContent(
			{
				code: body.code,
				newPassword: body.newPassword,
			} as IResetPasswordRequestBody);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async resetToken(body: ILogInRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.userName, "string");
		ThrowHelper.TypeError.throwIfNotType(body.password, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.resetToken());
		request.content = new JsonContent(
			{
				userName: body.userName,
				password: body.password,
			} as ILogInRequestBody);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async createBot(body: ICreateBotRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotType(body.displayName, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.bots());
		request.content = new JsonContent(
			{
				displayName: body.displayName,
			} as ICreateBotRequestBody);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new CreateBotResponse(JSON.parse(await response.content.readAsString()), this);
	}

	public async removeBot(userId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.bot({ route: { userId } }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async resetBotToken(userId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.resetBotToken({ route: { userId } }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new ResetBotTokenResponse(JSON.parse(await response.content.readAsString()), this);
	}

	public async banUser(userId: string, body: IBanUserRequestBody = {}, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNullable(body);
		ThrowHelper.TypeError.throwIfNotAnyType(body.reason, "string", "nullable");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.userBan({ route: { userId } }));
		request.content = new JsonContent(
			{
				reason: body.reason,
			} as IBanUserRequestBody);

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode === HttpStatusCode.Conflict)
		{
			// Instead of throwing, return null if the ban already exists.
			return null;
		}
		await RestClient.#ensureSuccessStatusCode(response);

		return new UserBan(new BanData(JSON.parse(await response.content.readAsString())), this);
	}

	public async unbanUser(userId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.userBan({ route: { userId } }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return;
	}

	public async getBans(query: IGetBansQuery = {}, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNullable(query);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.bans({ query }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
		           .map((b: any) => EntityFactory.createBan(new BanData(b), this)) as Ban[];
	}

	public async getUserBan(userId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.userBan({ route: { userId } }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode === HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createBan(new BanData(JSON.parse(await response.content.readAsString())), this);
	}

	public async getCurrentUserBanStatus(cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.currentUserBanStatus());

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new GetCurrentUserBanStatusResponse(JSON.parse(await response.content.readAsString()), this);
	}

	public async getFiles(query: IGetFilesQuery = {}, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNullable(query);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.files({ query }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
		           .map((f: any) => new File(new FileData(f), this)) as File[];
	}

	public async getFile(fileId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.file({ route: { fileId } }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode == HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		return new File(new FileData(JSON.parse(await response.content.readAsString())), this);
	}

	public async getFileContent(fileId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(fileId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.fileContent({ route: { fileId } }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode == HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		return new FileContent(response.content, this);
	}

	public async uploadFile(
		name: string,
		content: Uint8Array,
		contentType: string,
		cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(name, "string");
		ThrowHelper.TypeError.throwIfNotType(content, Uint8Array);
		ThrowHelper.TypeError.throwIfNotType(contentType, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.files());
		const reqContent = new MultipartFormDataContent();
		reqContent.add(new ByteArrayContent(content, contentType), "file", name);
		request.content = reqContent;

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new File(new FileData(JSON.parse(await response.content.readAsString())), this);
	}
}

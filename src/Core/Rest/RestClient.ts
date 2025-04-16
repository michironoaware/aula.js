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
import { GetUsersQuery } from "./GetUsersQuery.js";
import { UserData } from "./Entities/Models/UserData.js";
import { JsonContent } from "../../Common/Http/JsonContent.js";
import { RoomData } from "./Entities/Models/RoomData.js";
import { Room } from "./Entities/Room.js";
import { MessageData } from "./Entities/Models/MessageData.js";
import { Message } from "./Entities/Message.js";
import { LogInResponse } from "./LogInResponse.js";
import { CreateBotResponse } from "./CreateBotResponse.js";
import { ResetBotTokenResponse } from "./ResetBotTokenResponse.js";
import { BanData } from "./Entities/Models/BanData.js";
import { Ban } from "./Entities/Ban.js";
import { GetCurrentUserBanStatusResponse } from "./GetCurrentUserBanStatusResponse.js";
import { SealedClassError } from "../../Common/SealedClassError.js";
import { AulaGlobalRateLimiterHandler } from "./AulaGlobalRateLimiterHandler.js";
import { HttpFetchHandler } from "./HttpFetchHandler.js";
import { AulaRestError } from "./AulaRestError.js";
import { AulaRouteRateLimiterHandler } from "./AulaRouteRateLimiterHandler.js";
import { AulaHttpStatusCode503Handler } from "./AulaHttpStatusCode503Handler.js";
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
import { RestClientOptions } from "./RestClientOptions.js";
import { ModifyCurrentUserRequestBody } from "./ModifyCurrentUserRequestBody.js";
import { SetUserRoomRequestBody } from "./SetUserRoomRequestBody.js";
import { CreateRoomRequestBody } from "./CreateRoomRequestBody.js";
import { GetRoomsQuery } from "./GetRoomsQuery.js";
import { ModifyRoomRequestBody } from "./ModifyRoomRequestBody.js";
import { SetRoomConnectionsRequestBody } from "./SetRoomConnectionsRequestBody.js";
import { SetUserPermissionsRequestBody } from "./SetUserPermissionsRequestBody.js";
import { SendMessageRequestBody } from "./SendMessageRequestBody.js";
import { GetMessagesQuery } from "./GetMessagesQuery.js";
import { RegisterRequestBody } from "./RegisterRequestBody.js";
import { LogInRequestBody } from "./LogInRequestBody.js";
import { ConfirmEmailQuery } from "./ConfirmEmailQuery.js";
import { ForgotPasswordQuery } from "./ForgotPasswordQuery.js";
import { ResetPasswordRequestBody } from "./ResetPasswordRequestBody.js";
import { CreateBotRequestBody } from "./CreateBotRequestBody.js";
import { BanUserRequestBody } from "./BanUserRequestBody.js";
import { GetBansQuery } from "./GetBansQuery.js";

/**
 * Provides a client to interact with the Aula REST API.
 * @sealed
 * */
export class RestClient implements IDisposable
{
	readonly #_httpClient: HttpClient;
	readonly #_disposeHttpClient: boolean;
	#_disposed: boolean = false;

	public constructor(options: RestClientOptions = RestClientOptions.default)
	{
		SealedClassError.throwIfNotEqual(RestClient, new.target);
		ThrowHelper.TypeError.throwIfNotType(options, RestClientOptions);

		this.#_httpClient = options.httpClient ?? new HttpClient(
			new AulaHttpStatusCode503Handler(
				new AulaGlobalRateLimiterHandler(
					new AulaRouteRateLimiterHandler(
						new HttpFetchHandler(), true, true), true), true), true);

		this.#_disposeHttpClient = options.disposeHttpClient;
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

	public withBaseAddress(uri: URL)
	{
		ThrowHelper.TypeError.throwIfNotType(uri, URL);
		ObjectDisposedError.throwIf(this.#_disposed);

		this.#_httpClient.baseAddress = new URL(`${uri.href}${uri.href.endsWith("/") ? "" : "/"}api/v1/`);
		return this;
	}

	public withToken(value: string)
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

	public async getUsers(query: GetUsersQuery = GetUsersQuery.default, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(query, GetUsersQuery);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.users(undefined, query));

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

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.user({ userId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode === HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		return new User(new UserData(JSON.parse(await response.content.readAsString())), this);
	}

	public async modifyCurrentUser(body: ModifyCurrentUserRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, ModifyCurrentUserRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Patch, AulaRoute.currentUser());
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new User(new UserData(JSON.parse(await response.content.readAsString())), this);
	}

	public async setCurrentUserRoom(body: SetUserRoomRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, SetUserRoomRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.currentUserRoom());
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async setUserRoom(userId: string, body: SetUserRoomRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(body, SetUserRoomRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.userRoom({ userId }));
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async setUserPermissions(
		userId: string,
		body: SetUserPermissionsRequestBody,
		cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(body, SetUserPermissionsRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.userPermissions({ userId }));
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async createRoom(body: CreateRoomRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, CreateRoomRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.rooms());
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createRoom(new RoomData(JSON.parse(await response.content.readAsString())), this);
	}

	public async getRooms(query: GetRoomsQuery = GetRoomsQuery.default, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(query, GetRoomsQuery);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.rooms(undefined, query));

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

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.room({ roomId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode === HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createRoom(new RoomData(JSON.parse(await response.content.readAsString())), this);
	}

	public async modifyRoom(roomId: string, body: ModifyRoomRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(body, ModifyRoomRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Patch, AulaRoute.room({ roomId }));
		request.content = new JsonContent(body);

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

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.room({ roomId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async addRoomConnection(roomId: string, targetId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(targetId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.roomConnection({ roomId, targetId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async getRoomConnections(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomConnections({ roomId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse((await response.content.readAsString()))
		           .map((d: any) => EntityFactory.createRoom(new RoomData(d), this)) as Room[];
	}

	public async setRoomConnections(
		roomId: string,
		body: SetRoomConnectionsRequestBody,
		cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, SetRoomConnectionsRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.roomConnections({ roomId }));
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async removeRoomConnection(roomId: string, targetId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(targetId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.roomConnection({ roomId, targetId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async getRoomUsers(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomUsers({ roomId }));

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

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.startTyping({ roomId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async stopTyping(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.stopTyping({ roomId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async sendMessage(roomId: string, body: SendMessageRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(body, SendMessageRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.roomMessages({ roomId }));
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createMessage(new MessageData(JSON.parse(await response.content.readAsString())), this);
	}

	public async getMessage(roomId: string, messageId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(messageId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomMessage({ roomId, messageId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode === HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createMessage(new MessageData(JSON.parse((await response.content.readAsString()))), this);
	}

	public async getMessages(
		roomId: string,
		query: GetMessagesQuery = GetMessagesQuery.default,
		cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(query, GetMessagesQuery);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomMessages({ roomId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse((await response.content.readAsString()))
		           .map((d: any) => EntityFactory.createMessage(new MessageData(d), this)) as Message[];
	}

	public async removeMessage(roomId: string, messageId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(messageId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.roomMessage({ roomId, messageId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async register(body: RegisterRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, RegisterRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.register());
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async logIn(body: LogInRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, LogInRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.logIn());
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new LogInResponse(JSON.parse(await response.content.readAsString()), this);
	}

	public async confirmEmail(query: ConfirmEmailQuery, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(query, ConfirmEmailQuery);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ThrowHelper.TypeError.throwIf(query.email === null, "The 'email' query option is required but was not provided.");
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.confirmEmail(undefined, query));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async forgotPassword(query: ForgotPasswordQuery, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(query, ForgotPasswordQuery);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.forgotPassword(undefined, query));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async resetPassword(body: ResetPasswordRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, ResetPasswordRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.resetPassword());
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async resetToken(body: LogInRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, LogInRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.resetToken());
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async createBot(body: CreateBotRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, CreateBotRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.bots());
		request.content = new JsonContent(body);

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

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.bot({ userId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async resetBotToken(userId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.resetBotToken({ userId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new ResetBotTokenResponse(JSON.parse(await response.content.readAsString()), this);
	}

	public async banUser(
		userId: string,
		body: BanUserRequestBody = BanUserRequestBody.default,
		cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(body, BanUserRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.userBan({ userId }));
		request.content = new JsonContent(body);

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

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.userBan({ userId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async getBans(query: GetBansQuery = GetBansQuery.default, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(query, GetBansQuery);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.bans(undefined, query));

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

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.userBan({ userId }));

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

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.files(undefined, query));

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

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.file({ fileId }));

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

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.fileContent({ fileId }));

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

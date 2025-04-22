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
import { GetFilesQuery } from "./GetFilesQuery.js";
import { Permissions } from "./Entities/Permissions.js";
import { OperationCanceledError } from "../../Common/Threading/OperationCanceledError.js";
import { UserUpdatedEvent } from "../Gateway/UserUpdatedEvent.js";

/**
 * Provides an abstraction to interact with the Aula REST API.
 * @sealed
 * */
export class RestClient implements IDisposable
{
	readonly #_httpClient: HttpClient;
	readonly #_disposeHttpClient: boolean;
	#_disposed: boolean = false;

	/**
	 * Initializes a new instance of {@link RestClient}.
	 * @param options The configuration options for this client.
	 * */
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

			let problemDetails: ProblemDetails | undefined;
			try
			{
				problemDetails = new ProblemDetails(JSON.parse(await response.content.readAsString()));
			}
			catch (error)
			{
				if (!(error instanceof SyntaxError))
				{
					throw error;
				}
			}

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

	/**
	 * Sets the address of the Aula server where requests should be sent.
	 * @param uri A URI that points to the desired server.
	 * @returns The current {@link RestClient} instance.
	 * @throws {TypeError} If {@link uri} is not a {@link URL}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * */
	public withAddress(uri: URL)
	{
		ThrowHelper.TypeError.throwIfNotType(uri, URL);
		ObjectDisposedError.throwIf(this.#_disposed);

		this.#_httpClient.baseAddress = new URL(`${uri.href}${uri.href.endsWith("/") ? "" : "/"}api/v1/`);
		return this;
	}

	/**
	 * Sets the authorization token used to authenticate and make requests.
	 * @param token The token string, or `null` to clear the current token.
	 * @returns The current {@link RestClient} instance.
	 * @throws {TypeError} If {@link token} is not a {@link string}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * */
	public withToken(token: string | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(token, "string", "null");
		ObjectDisposedError.throwIf(this.#_disposed);

		this.#_httpClient.defaultRequestHeaders.delete("Authorization");
		if (token !== null)
		{
			this.#_httpClient.defaultRequestHeaders.add("Authorization", `Bearer ${token}`);
		}

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

	/**
	 * Gets the user of the current requester's account.
	 * Requires authentication.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link User} that represents the user.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getCurrentUser(cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.currentUser());

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new User(new UserData(JSON.parse(await response.content.readAsString())), this);
	}

	/**
	 * Gets a collection of users.
	 * Requires authentication.
	 * @param query The query options for retrieving users.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link User} array that contains the requested users.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getUsers(query: GetUsersQuery = GetUsersQuery.default, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(query, GetUsersQuery);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.users(undefined, query));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
		           .map((d: any) => new User(new UserData(d), this)) as User[];
	}

	/**
	 * Gets a user.
	 * Requires authentication.
	 * @param userId The id of the user.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link User}, or `null` if the requested user does not exist.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getUser(userId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.user({ userId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode === HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		return new User(new UserData(JSON.parse(await response.content.readAsString())), this);
	}

	/**
	 * Modify the requester's account settings.
	 * Requires authentication.
	 * Fires an {@link UserUpdatedEvent} gateway event.
	 * @param body The request body.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link User} that represents the modified user.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async modifyCurrentUser(body: ModifyCurrentUserRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, ModifyCurrentUserRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Patch, AulaRoute.currentUser());
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new User(new UserData(JSON.parse(await response.content.readAsString())), this);
	}

	/**
	 * Moves the requester's user to the specified room.
	 * Requires authentication and the {@link Permissions.SetOwnCurrentRoom} permission.
	 * Fires an {@link UserCurrentRoomUpdatedEvent} gateway event.
	 * @param body The request body.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async setCurrentUserRoom(body: SetUserRoomRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, SetUserRoomRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.currentUserRoom());
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Moves the specified user to a specific room.
	 * Requires authentication and the {@link Permissions.SetCurrentRoom} permission.
	 * Fires an {@link UserCurrentRoomUpdatedEvent} gateway event.
	 * @param userId The id of the user to move.
	 * @param body The request body.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaNotFoundError} If the specified user does not exist.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async setUserRoom(userId: string, body: SetUserRoomRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(body, SetUserRoomRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.userRoom({ userId }));
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Sets the permissions of a user.
	 * Requires authentication and the {@link Permissions.Administrator} permission.
	 * Fires an {@link UserUpdatedEvent} gateway event.
	 * @param userId The id of the user.
	 * @param body The request body.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaNotFoundError} If the specified user does not exist.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
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
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.userPermissions({ userId }));
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Creates a room.
	 * Requires authentication and the {@link Permissions.ManageRooms} permission.
	 * Fires a {@link RoomCreatedEvent} gateway event.
	 * @param body The request body.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Room} that represents the created room.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async createRoom(body: CreateRoomRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, CreateRoomRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.rooms());
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createRoom(new RoomData(JSON.parse(await response.content.readAsString())), this);
	}

	/**
	 * Gets a collection of rooms.
	 * Requires authentication.
	 * @param query The query options for retrieving rooms.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Room} array that contains the requested rooms.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getRooms(query: GetRoomsQuery = GetRoomsQuery.default, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(query, GetRoomsQuery);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.rooms(undefined, query));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
		           .map((d: any) => EntityFactory.createRoom(new RoomData(d), this)) as Room[];
	}

	/**
	 * Gets a room.
	 * Requires authentication.
	 * @param roomId The id of the room.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Room}, or `null` if the requested room does not exist.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getRoom(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.room({ roomId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode === HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createRoom(new RoomData(JSON.parse(await response.content.readAsString())), this);
	}

	/**
	 * Modifies the specified room.
	 * Requires authentication and the {@link Permissions.ManageRooms} permission.
	 * Fires a {@link RoomUpdatedEvent} gateway event.
	 * @param roomId The id of the room to modify.
	 * @param body The request body.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Room} that represents the modified room.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaNotFoundError} If the specified room does not exist.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async modifyRoom(roomId: string, body: ModifyRoomRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(body, ModifyRoomRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Patch, AulaRoute.room({ roomId }));
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createRoom(new RoomData(JSON.parse(await response.content.readAsString())), this);
	}

	/**
	 * Removes the specified room.
	 * Requires authentication and the {@link Permissions.ManageRooms} permission.
	 * Fires a {@link RoomRemovedEvent} gateway event.
	 * @param roomId The id of the room to modify.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async removeRoom(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.room({ roomId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Enable users to move from one room to another.
	 * Requires authentication and the {@link Permissions.ManageRooms} permission.
	 * Fires a {@link RoomConnectionCreatedEvent} gateway event.
	 * @param sourceId The id of the room from which users must come.
	 * @param targetId The id of the room users will be able to go to.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaNotFoundError} If the specified room does not exist.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async addRoomConnection(sourceId: string, targetId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(sourceId, "string");
		ThrowHelper.TypeError.throwIfNotType(targetId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.roomConnection({ sourceId, targetId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Gets the rooms connected to the specified room.
	 * Requires authentication.
	 * @param roomId The id of the room whose connections retrieve.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Room} array that contains the requested rooms.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaNotFoundError} If the specified room does not exist.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getRoomConnections(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomConnections({ roomId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse((await response.content.readAsString()))
		           .map((d: any) => EntityFactory.createRoom(new RoomData(d), this)) as Room[];
	}

	/**
	 * Sets the connected rooms of a room.
	 * Requires authentication and the {@link Permissions.ManageRooms} permission.
	 * May fire one or multiple {@link RoomConnectionCreatedEvent} gateway events.
	 * May fire one or multiple {@link RoomConnectionRemovedEvent} gateway events.
	 * @param roomId The id of the source room whose connections set.
	 * @param body The request body.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaNotFoundError} If the specified room does not exist.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async setRoomConnections(
		roomId: string,
		body: SetRoomConnectionsRequestBody,
		cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, SetRoomConnectionsRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.roomConnections({ roomId }));
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Disable users to move from one room to another.
	 * Requires authentication and the {@link Permissions.ManageRooms} permission.
	 * Fires a {@link RoomConnectionRemovedEvent} gateway event.
	 * @param sourceId The id of the room users must be in.
	 * @param targetId The id of the room users will not be able to go to.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async removeRoomConnection(sourceId: string, targetId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(sourceId, "string");
		ThrowHelper.TypeError.throwIfNotType(targetId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.roomConnection({ sourceId, targetId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Gets the users inside the specified room.
	 * Requires authentication.
	 * @param roomId The id of the room whose users retrieve.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link User} array.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaNotFoundError} If the specified room does not exist.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getRoomUsers(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomUsers({ roomId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
		           .map((d: any) => new User(new UserData(d), this)) as User[];
	}

	/**
	 * Notifies in the specified room that the user of the current requester's account is typing a message.
	 * Requires authentication and the {@link Permissions.SendMessages} permission.
	 * Fires a {@link UserStartedTypingEvent} gateway event.
	 * @param roomId The id of the room.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaNotFoundError} If the specified room does not exist.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async startTyping(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.startTyping({ roomId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Notifies in the specified room that the user of the current requester's account is no longer typing a message.
	 * Requires authentication and the {@link Permissions.SendMessages} permission.
	 * Fires a {@link UserStoppedTypingEvent} gateway event.
	 * @param roomId The id of the room.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaNotFoundError} If the specified room does not exist.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async stopTyping(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.stopTyping({ roomId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Sends a message to the specified room.
	 * Requires authentication and the {@link Permissions.SendMessages} permission.
	 * Fires a {@link MessageCreatedEvent} gateway event.
	 * @param roomId The id of the room.
	 * @param body The request body.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Message} that represents the message sent.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaNotFoundError} If the specified room does not exist.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async sendMessage(roomId: string, body: SendMessageRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(body, SendMessageRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.roomMessages({ roomId }));
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createMessage(new MessageData(JSON.parse(await response.content.readAsString())), this);
	}

	/**
	 * Gets a message sent in a room.
	 * Requires authentication and the {@link Permissions.ReadMessages} permission.
	 * @param roomId The id of the room where the message was sent.
	 * @param messageId The id of the message to retrieve.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Message}, or `null` if the message does not exist.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getMessage(roomId: string, messageId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(messageId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomMessage({ roomId, messageId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode === HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createMessage(new MessageData(JSON.parse((await response.content.readAsString()))), this);
	}

	/**
	 * Gets a collection of messages sent in a room.
	 * Requires authentication and the {@link Permissions.ReadMessages} permission.
	 * @param roomId The id of the room where the messages were sent.
	 * @param query The query options for retrieving messages.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Message} array.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaNotFoundError} If the specified room does not exist.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
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
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomMessages({ roomId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse((await response.content.readAsString()))
		           .map((d: any) => EntityFactory.createMessage(new MessageData(d), this)) as Message[];
	}

	/**
	 * Removes a previously sent message.
	 * Requires authentication.
	 * Requires the {@link Permissions.ManageMessages} permission or being the user that sent the message.
	 * Fires a {@link MessageRemovedEvent} gateway event.
	 * @param roomId The id of the room where the message was sent.
	 * @param messageId The id of the message to remove.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async removeMessage(roomId: string, messageId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(messageId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.roomMessage({ roomId, messageId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Register a new user in the application.
	 * @param body The request body.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * */
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

	/**
	 * Log in a user to the application.
	 * @param body The request body.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link LogInResponse}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * */
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

	/**
	 * Requests a confirmation email or confirms an email.
	 * @param query The email confirmation query options.
	 *              If {@link ConfirmEmailQuery.code} is `null`,
	 *              a confirmation email will be sent (if a user with the specified email address exists).
	 *              If a code is provided, an attempt will be made to confirm the email using that code.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * */
	public async confirmEmail(query: ConfirmEmailQuery, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(query, ConfirmEmailQuery);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.confirmEmail(undefined, query));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Sends a password reset email.
	 * @param query The query options.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * */
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

	/**
	 * Resets the password of a user.
	 * @param body The request body.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * */
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

	/**
	 * Log out a user from all devices.
	 * @param body The request body.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * */
	public async logOut(body: LogInRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, LogInRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.logOut());
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Creates a new bot user account.
	 * Requires authentication and the {@link Permissions.Administrator} permission.
	 * @param body The request body.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link CreateBotResponse}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async createBot(body: CreateBotRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, CreateBotRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.bots());
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new CreateBotResponse(JSON.parse(await response.content.readAsString()), this);
	}

	/**
	 * Removes a bot user account from the application.
	 * Requires authentication and the {@link Permissions.Administrator} permission.
	 * @param userId The id of the bot user.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async removeBot(userId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.bot({ userId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Resets the token of a bot user.
	 * @param userId The id of the bot user.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link ResetBotTokenResponse}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaNotFoundError} If the specified bot user does not exist.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async resetBotToken(userId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.resetBotToken({ userId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new ResetBotTokenResponse(JSON.parse(await response.content.readAsString()), this);
	}

	/**
	 * Ban a user from the application.
	 * Requires authentication and the {@link Permissions.BanUsers} permission.
	 * Fires a {@link BanCreatedEvent} gateway event.
	 * @param userId The id of the user to ban.
	 * @param body The request body.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link UserBan}, or `null` if the user is already banned.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
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
		this.#throwIfNullToken();

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

	/**
	 * Unban a user from the application.
	 * Requires authentication and the {@link Permissions.BanUsers} permission.
	 * Fires a {@link BanRemovedEvent} gateway event.
	 * @param userId The id of the user to unban.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async unbanUser(userId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.userBan({ userId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Gets a collection of bans.
	 * Requires authentication and the {@link Permissions.BanUsers} permission.
	 * @param query The query options.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Ban} array.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getBans(query: GetBansQuery = GetBansQuery.default, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(query, GetBansQuery);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.bans(undefined, query));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
		           .map((b: any) => EntityFactory.createBan(new BanData(b), this)) as Ban[];
	}

	/**
	 * Gets the ban of a specific user.
	 * Requires authentication and the {@link Permissions.BanUsers} permission.
	 * @param userId The id of the user.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Ban}, or `null` if the user is not banned.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getUserBan(userId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.userBan({ userId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode === HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createBan(new BanData(JSON.parse(await response.content.readAsString())), this);
	}

	/**
	 * Gets the current ban status for the requester's user.
	 * Requires authentication.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link GetCurrentUserBanStatusResponse}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getCurrentUserBanStatus(cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.currentUserBanStatus());

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new GetCurrentUserBanStatusResponse(JSON.parse(await response.content.readAsString()), this);
	}

	/**
	 * Gets a collection of files.
	 * Requires authentication.
	 * @remarks This method does not retrieve the content of the files;
	 *          To get the content of a file, call {@link RestClient.getFileContent}.
	 * @param query The query options.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link File} array.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getFiles(query: GetFilesQuery = GetFilesQuery.default, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(query, GetFilesQuery);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.files(undefined, query));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
		           .map((f: any) => new File(new FileData(f), this)) as File[];
	}

	/**
	 * Gets a file.
	 * Requires authentication.
	 * @remarks This method does not retrieve the content of the file;
	 *          To get the content, call {@link RestClient.getFileContent} instead.
	 * @param fileId The id of the file.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link File}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getFile(fileId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.file({ fileId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode == HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		return new File(new FileData(JSON.parse(await response.content.readAsString())), this);
	}

	/**
	 * Gets the content of a file.
	 * Requires authentication.
	 * @param fileId The id of the file.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link FileContent}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getFileContent(fileId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(fileId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.fileContent({ fileId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode == HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		return new FileContent(response.content, this);
	}

	/**
	 * Upload a file to the application.
	 * Requires authentication and the {@link Permissions.UploadFiles} permission.
	 * @param name A name for the file.
	 * @param content The byte array with the content.
	 * @param contentType The media type of the content as defined in {@link https://www.rfc-editor.org/rfc/rfc6838 RFC 6836}.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link File}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
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
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.files());
		const reqContent = new MultipartFormDataContent();
		reqContent.add(new ByteArrayContent(content, contentType), "file", name);
		request.content = reqContent;

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new File(new FileData(JSON.parse(await response.content.readAsString())), this);
	}

	#throwIfNullToken()
	{
		if (!this.#_httpClient.defaultRequestHeaders.has("Authorization"))
		{
			throw new AulaUnauthorizedError();
		}
	}
}

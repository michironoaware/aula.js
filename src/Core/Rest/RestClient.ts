import { HttpClient } from "../../Common/Http/HttpClient";
import { ThrowHelper } from "../../Common/ThrowHelper";
import { HttpResponseMessage } from "../../Common/Http/HttpResponseMessage";
import { HttpRequestError } from "../../Common/Http/HttpRequestError";
import { HttpStatusCode } from "../../Common/Http/HttpStatusCode";
import { AulaUnauthorizedError } from "./AulaUnauthorizedError";
import { AulaForbiddenError } from "./AulaForbiddenError";
import { AulaBadRequestError } from "./AulaBadRequestError";
import { AulaNotFoundError } from "./AulaNotFoundError";
import { HttpMethod } from "../../Common/Http/HttpMethod";
import { HttpRequestMessage } from "../../Common/Http/HttpRequestMessage";
import { AulaRoute } from "../AulaRoute";
import { User } from "./Entities/User";
import { GetUsersQuery } from "./GetUsersQuery";
import { UserData } from "./Entities/Models/UserData";
import { JsonContent } from "../../Common/Http/JsonContent";
import { RoomData } from "./Entities/Models/RoomData";
import { Room } from "./Entities/Room";
import { MessageData } from "./Entities/Models/MessageData";
import { Message } from "./Entities/Message";
import { LogInResponse } from "./LogInResponse";
import { CreateBotResponse } from "./CreateBotResponse";
import { ResetBotTokenResponse } from "./ResetBotTokenResponse";
import { BanData } from "./Entities/Models/BanData";
import { Ban } from "./Entities/Ban";
import { GetCurrentUserBanStatusResponse } from "./GetCurrentUserBanStatusResponse";
import { SealedClassError } from "../../Common/SealedClassError";
import { AulaGlobalRateLimiterHandler } from "./AulaGlobalRateLimiterHandler";
import { HttpFetchHandler } from "./HttpFetchHandler";
import { AulaRestError } from "./AulaRestError";
import { AulaRouteRateLimiterHandler } from "./AulaRouteRateLimiterHandler";
import { AulaHttpStatusCode503Handler } from "./AulaHttpStatusCode503Handler";
import { UserBan } from "./Entities/UserBan";
import { EntityFactory } from "./Entities/EntityFactory";
import { ProblemDetails } from "./Entities/Models/ProblemDetails";
import { FileData } from "./Entities/Models/FileData";
import { File } from "./Entities/File";
import { FileContent } from "./Entities/FileContent";
import { MultipartFormDataContent } from "../../Common/Http/MultipartFormDataContent";
import { ByteArrayContent } from "../../Common/Http/ByteArrayContent";
import { CancellationToken } from "../../Common/Threading/CancellationToken";
import { ObjectDisposedError } from "../../Common/ObjectDisposedError";
import { RestClientOptions } from "./RestClientOptions";
import { ModifyUserRequestBody } from "./ModifyUserRequestBody";
import { CreateRoomRequestBody } from "./CreateRoomRequestBody";
import { GetRoomsQuery } from "./GetRoomsQuery";
import { ModifyRoomRequestBody } from "./ModifyRoomRequestBody";
import { SendMessageRequestBody } from "./SendMessageRequestBody";
import { GetMessagesQuery } from "./GetMessagesQuery";
import { RegisterRequestBody } from "./RegisterRequestBody";
import { LogInRequestBody } from "./LogInRequestBody";
import { ConfirmEmailQuery } from "./ConfirmEmailQuery";
import { ForgotPasswordQuery } from "./ForgotPasswordQuery";
import { ResetPasswordRequestBody } from "./ResetPasswordRequestBody";
import { CreateBotRequestBody } from "./CreateBotRequestBody";
import { BanUserRequestBody } from "./BanUserRequestBody";
import { GetBansQuery } from "./GetBansQuery";
import { GetFilesQuery } from "./GetFilesQuery";
import { Permissions } from "./Entities/Permissions";
import { UserUpdatedEvent } from "../Gateway/UserUpdatedEvent";
import { IAsyncDisposable } from "../../Common/IAsyncDisposable";
import { RestClientNullAddressError } from "./RestClientNullAddressError";
import { CreateRoleRequestBody } from "./CreateRoleRequestBody";
import { RoleData } from "./Entities/Models/RoleData";
import { Role } from "./Entities/Role";
import { ModifyRoleRequestBody } from "./ModifyRoleRequestBody";
import { GetRolesQuery } from "./GetRolesQuery";
import { ModifyRolePositionsRequestBody } from "./ModifyRolePositionsRequestBody";

/**
 * Provides a client to interact with the Aula REST API.
 * @sealed
 * */
export class RestClient implements IAsyncDisposable
{
	readonly #_httpClient: HttpClient;
	readonly #_disposeHttpClient: boolean;
	#_cache: Map<string, object> | null = null;
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

		if (options.address !== null)
		{
			this.withAddress(options.address);
		}

		if (options.token !== null)
		{
			this.withToken(options.token);
		}

		if (options.cache !== null)
		{
			this.#_cache = options.cache;
		}
	}

	/**
	 * Gets whether this {@link RestClient} instance has an authorization token configured.
	 * */
	public get hasToken()
	{
		return this.#_httpClient.defaultRequestHeaders.has("Authorization");
	}

	/**
	 * Gets the address of the Aula server.
	 * @remarks This property returns a copy of the current address.
	 * */
	public get address()
	{
		return this.#_httpClient.baseAddress ? new URL(this.#_httpClient.baseAddress) : this.#_httpClient.baseAddress;
	}

	/**
	 * Gets the client’s cache instance used for storing entities.
	 * Entities can be retrieved by id.
	 */
	public get cache()
	{
		return this.#_cache;
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

	/**
	 * Gets the client’s cache instance used for storing entities.
	 * @param cache An object instance whose type conforms to the {@link Map} interface, where entities will be stored,
	 *              or `null` to disable caching.
	 * @remarks
	 * The provided cache is used to store entities created by this {@link RestClient} instance.
	 * However, the cache is not checked before making a new request — all requests always fetch
	 * the latest version from the server.
	 *
	 * It is recommended to use a shared cache, especially with a {@link GatewayClient}
	 * instance that actively listens for entity updates and maintains the cache’s accuracy.
	 * @returns The current {@link RestClient} instance.
	 * @throws {TypeError} If {@link cache} is not a {@link object}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * */
	public withCache(cache: Map<string, object> | null)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(cache, "object", "null");
		ObjectDisposedError.throwIf(this.#_disposed);

		this.#_cache = cache;
		return this;
	}

	public async [Symbol.asyncDispose]()
	{
		if (this.#_disposed)
		{
			return;
		}

		if (this.#_disposeHttpClient)
		{
			await this.#_httpClient[Symbol.asyncDispose]();
		}

		this.#_disposed = true;
	}

	/**
	 * Gets a ban.
	 * Requires authentication and the {@link Permissions.BanUsers} permission.
	 * @param banId The ID of the ban.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Ban}, or `null` if the specified ban does not exist.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getBan(banId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(banId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.ban({ banId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode === HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createBan(new BanData(JSON.parse(await response.content.readAsString())), this);
	}

	/**
	 * Gets a collection of bans.
	 * Requires authentication and the {@link Permissions.BanUsers} permission.
	 * @param query The query options.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Ban} array.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
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
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.bans(undefined, query));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
		           .map((b: any) => EntityFactory.createBan(new BanData(b), this)) as Ban[];
	}

	/**
	 * Lift an active ban.
	 * Requires authentication and the {@link Permissions.BanUsers} permission.
	 * @param banId The ID of the ban.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaNotFoundError} If the specified ban does not exist.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async liftBan(banId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(banId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.banLift({ banId }));

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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
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
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.bots());
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new CreateBotResponse(JSON.parse(await response.content.readAsString()), this);
	}

	/**
	 * Deletes a bot user account from the application.
	 * Requires authentication and the {@link Permissions.Administrator} permission.
	 * @param userId The id of the bot user.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async deleteBot(userId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
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
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.resetBotToken({ userId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new ResetBotTokenResponse(JSON.parse(await response.content.readAsString()), this);
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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
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
		this.#throwIfNullAddress();
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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getFile(fileId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
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
		this.#throwIfNullAddress();
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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
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
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.files());
		const reqContent = new MultipartFormDataContent();
		reqContent.add(new ByteArrayContent(content, contentType), "file", name);
		request.content = reqContent;

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new File(new FileData(JSON.parse(await response.content.readAsString())), this);
	}

	/**
	 * Register a new user in the application.
	 * @param body The request body.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * */
	public async register(body: RegisterRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, RegisterRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();

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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * */
	public async logIn(body: LogInRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, LogInRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();

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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * */
	public async confirmEmail(query: ConfirmEmailQuery, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(query, ConfirmEmailQuery);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();

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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * */
	public async forgotPassword(query: ForgotPasswordQuery, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(query, ForgotPasswordQuery);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();

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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * */
	public async resetPassword(body: ResetPasswordRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, ResetPasswordRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.resetPassword());
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
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
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.startTyping({ roomId }));

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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * */
	public async logOut(body: LogInRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, LogInRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.logOut());
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Permanently deletes a user's account.
	 * @param body The request body.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * */
	public async deleteIdentity(body: LogInRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, LogInRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.deleteIdentity());
		request.content = new JsonContent(body);

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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
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
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.messages({ roomId }));
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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
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
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.message({ roomId, messageId }));

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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
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
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.messages({ roomId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse((await response.content.readAsString()))
		           .map((d: any) => EntityFactory.createMessage(new MessageData(d), this)) as Message[];
	}

	/**
	 * Deletes a previously sent message.
	 * Requires authentication.
	 * Requires the {@link Permissions.ManageMessages} permission or being the user that sent the message.
	 * Fires a {@link MessageDeletedEvent} gateway event.
	 * @param roomId The id of the room where the message was sent.
	 * @param messageId The id of the message to remove.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async deleteMessage(roomId: string, messageId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(messageId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.message({ roomId, messageId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Sends a ping to the server.
	 * @param address The address of the server.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link boolean} indicating if the server replied with a pong.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * */
	public async ping(address?: URL, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotAnyType(address, URL, "undefined");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		if (address === undefined)
		{
			this.#throwIfNullAddress();
		}

		const uri = address ?
			new URL(`${address.href}${address.href.endsWith("/") ? "" : "/"}api/v1/${AulaRoute.ping()}`)
			: AulaRoute.ping();
		const request = new HttpRequestMessage(HttpMethod.Get, uri);

		try
		{
			const response = await this.#_httpClient.send(request, cancellationToken);
			return response.isSuccessStatusCode;
		}
		catch (err)
		{
			if (!(err instanceof TypeError))
				//Unexpected error, rethrow.
			{
				throw err;
			}

			return false;
		}
	}

	public async getRole(roleId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roleId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.role({ roleId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		if (response.statusCode === HttpStatusCode.NotFound)
		{
			return null;
		}

		await RestClient.#ensureSuccessStatusCode(response);

		return new Role(new RoleData(JSON.parse(await response.content.readAsString())), this);
	}

	public async getRoles(
		query: GetRolesQuery = GetRolesQuery.default,
		cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(query, GetRolesQuery);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roles(undefined, query));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse((await response.content.readAsString()))
		           .map((d: any) => new Role(new RoleData(d), this)) as Role[];
	}

	public async createRole(body: CreateRoleRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, CreateRoleRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.roles());
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new Role(new RoleData(JSON.parse(await response.content.readAsString())), this);
	}

	public async modifyRole(
		roleId: string,
		body: ModifyRoleRequestBody,
		cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roleId, "string");
		ThrowHelper.TypeError.throwIfNotType(body, ModifyRoleRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Patch, AulaRoute.role({ roleId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new Role(new RoleData(JSON.parse(await response.content.readAsString())), this);
	}

	public async modifyRolePositions(body: ModifyRolePositionsRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(body, ModifyRolePositionsRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Patch, AulaRoute.roles());
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse((await response.content.readAsString()))
		           .map((d: any) => new Role(new RoleData(d), this)) as Role[];
	}

	public async deleteRole(roleId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roleId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.role({ roleId }));

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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
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
		this.#throwIfNullAddress();
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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
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
		this.#throwIfNullAddress();
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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
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
		this.#throwIfNullAddress();
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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
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
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Patch, AulaRoute.room({ roomId }));
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return EntityFactory.createRoom(new RoomData(JSON.parse(await response.content.readAsString())), this);
	}

	/**
	 * Deletes the specified room.
	 * Requires authentication and the {@link Permissions.ManageRooms} permission.
	 * Fires a {@link RoomDeletedEvent} gateway event.
	 * @param roomId The id of the room to modify.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async deleteRoom(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.room({ roomId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Enable users to move from one room to another.
	 * Requires authentication and the {@link Permissions.ManageRooms} permission.
	 * Fires a {@link RoomUpdatedEvent} gateway event.
	 * @param roomId The id of the room from which users must come.
	 * @param destinationId The id of the room users will be able to go to.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaNotFoundError} If the specified room does not exist.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async addRoomDestination(roomId: string, destinationId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(destinationId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.roomDestination({ roomId, destinationId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Gets the rooms a user can go from the specified room.
	 * Requires authentication.
	 * @param roomId The id of the room whose connections retrieve.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Room} array that contains the requested rooms.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaNotFoundError} If the specified room does not exist.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getRoomDestinations(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomDestinations({ roomId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse((await response.content.readAsString()))
		           .map((d: any) => EntityFactory.createRoom(new RoomData(d), this)) as Room[];
	}

	/**
	 * Disable users to move from one room to another.
	 * Requires authentication and the {@link Permissions.ManageRooms} permission.
	 * Fires a {@link RoomConnectionRemovedEvent} gateway event.
	 * @param roomId The id of the room users must be in.
	 * @param destinationId The id of the room users will not be able to go to.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves once the operation is complete.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async removeRoomDestination(roomId: string, destinationId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(destinationId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.roomDestination({ roomId, destinationId }));

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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaNotFoundError} If the specified room does not exist.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getRoomResidents(roomId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(roomId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.roomResidents({ roomId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
		           .map((d: any) => new User(new UserData(d), this)) as User[];
	}

	public async addRole(userId: string, roleId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(roleId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Put, AulaRoute.userRole({ userId, roleId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	public async removeRole(userId: string, roleId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(roleId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Delete, AulaRoute.userRole({ userId, roleId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);
	}

	/**
	 * Gets the collection of bans for a specific user.
	 * Requires authentication and the {@link Permissions.BanUsers} permission.
	 * @param userId The id of the user.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link Ban} array that contains the bans issued for the specified user.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaNotFoundError} If the specified user does not exist.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getUserBans(userId: string, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.userBans({ userId }));

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return JSON.parse(await response.content.readAsString())
		           .map((b: any) => EntityFactory.createBan(new BanData(b), this)) as UserBan[];
	}

	/**
	 * Gets the current ban status for the requester's user.
	 * Requires authentication.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link GetCurrentUserBanStatusResponse}.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getCurrentUserBanStatus(cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Get, AulaRoute.currentUserBanStatus());

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new GetCurrentUserBanStatusResponse(JSON.parse(await response.content.readAsString()), this);
	}

	/**
	 * Gets the user of the current requester's account.
	 * Requires authentication.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link User} that represents the user.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async getCurrentUser(cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
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
		this.#throwIfNullAddress();
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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
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
		this.#throwIfNullAddress();
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
	 * Modifies the specified user.
	 * Requires authentication.
	 * Requires {@link Permissions.SetCurrentRoom} to update the current room of a user other than the requester.
	 * Requires {@link Permissions.ManageRoles} to update the assigned roles.
	 * Fires an {@link UserUpdatedEvent} gateway event.
	 * @param userId The ID of the user to modify.
	 * @param body The request body.
	 * @param cancellationToken A {@link CancellationToken} to listen to.
	 * @returns A promise that resolves to a {@link User} that represents the modified user.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * @throws {OperationCanceledError} If the {@link cancellationToken} has been signaled.
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaForbiddenError} If the user has no permission to access the resource.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing, invalid.
	 * */
	public async modifyUser(userId: string, body: ModifyUserRequestBody, cancellationToken: CancellationToken = CancellationToken.none)
	{
		ThrowHelper.TypeError.throwIfNotType(userId, "string");
		ThrowHelper.TypeError.throwIfNotType(body, ModifyUserRequestBody);
		ThrowHelper.TypeError.throwIfNotType(cancellationToken, CancellationToken);
		ObjectDisposedError.throwIf(this.#_disposed);
		cancellationToken.throwIfCancellationRequested();
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Patch, AulaRoute.user({ userId }));
		request.content = new JsonContent(body);

		const response = await this.#_httpClient.send(request, cancellationToken);
		await RestClient.#ensureSuccessStatusCode(response);

		return new User(new UserData(JSON.parse(await response.content.readAsString())), this);
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
	 * @throws {RestClientNullAddressError} If no server address for the {@link RestClient} has been defined.
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
		this.#throwIfNullAddress();
		this.#throwIfNullToken();

		const request = new HttpRequestMessage(HttpMethod.Post, AulaRoute.userBans({ userId }));
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

	#throwIfNullToken()
	{
		if (!this.#_httpClient.defaultRequestHeaders.has("Authorization"))
		{
			throw new AulaUnauthorizedError();
		}
	}

	#throwIfNullAddress()
	{
		if (this.#_httpClient.baseAddress === null)
		{
			throw new RestClientNullAddressError(this);
		}
	}
}

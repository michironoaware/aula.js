import { HttpStatusCode } from "../../Common/Http/HttpStatusCode";
import { ProblemDetails } from "./Entities/Models/ProblemDetails";
import { ThrowHelper } from "../../Common/ThrowHelper";
import { AulaUnauthorizedError } from "./AulaUnauthorizedError";
import { AulaForbiddenError } from "./AulaForbiddenError";
import { AulaBadRequestError } from "./AulaBadRequestError";
import { AulaNotFoundError } from "./AulaNotFoundError";
import { AulaRestError } from "./AulaRestError";
import { SealedClassError } from "../../Common/SealedClassError";

/**
 * Represents the result of rest operation.
 * @sealed
 * */
export class RestResult<TResult extends {} | null | void = void>
{
	static #s_success: RestResult<void> | null = null;
	readonly #_succeeded: boolean;
	readonly #_statusCode: HttpStatusCode | null;
	readonly #_value?: TResult;
	readonly #_problemDetails: ProblemDetails | null;

	/**
	 * @package
	 * */
	public constructor(succeeded: true, result: TResult);

	/**
	 * @package
	 * */
	public constructor(succeeded: false, problemDetails: ProblemDetails | null, status: HttpStatusCode);

	/**
	 * @package
	 * */
	constructor(succeeded: boolean, arg1: TResult | ProblemDetails | null, status?: HttpStatusCode)
	{
		SealedClassError.throwIfNotEqual(RestResult, new.target);
		ThrowHelper.TypeError.throwIfNotType(succeeded, "boolean");
		ThrowHelper.TypeError.throwIfNotType(status, "number");
		ThrowHelper.TypeError.throwIfUndefined(arg1);

		this.#_succeeded = succeeded;
		if (succeeded)
		{
			ThrowHelper.TypeError.throwIfType(arg1, ProblemDetails);
			this.#_value = arg1;
			this.#_statusCode = null;
			this.#_problemDetails = null;
		} else
		{
			ThrowHelper.TypeError.throwIfNotAnyType(arg1, ProblemDetails, "null");
			this.#_statusCode = status;
			this.#_problemDetails = arg1;
		}
	}

	public static get success()
	{
		return this.#s_success ??= new RestResult<void>(true, void (0));
	}

	/**
	 * Gets whether the operation was successful
	 * */
	public get succeeded()
	{
		return this.#_succeeded;
	}

	/**
	 * Gets the problem details associated with a failed result.
	 * Returns `null` if the result was successful or if no problem details were provided.
	 * */
	public get problemDetails()
	{
		return this.#_problemDetails;
	}

	/**
	 * Gets the value of a successful result.
	 * Throws an appropriate error if the result is a failure.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing or invalid.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaNotFoundError} If a resource does not exist.
	 * @throws AulaRestError A general error for unexpected or uncategorized REST
	 *                       failures when none of the more specific errors apply.
	 * */
	public get value()
	{
		this.ensureSuccess();
		return this.#_value as TResult;
	}

	/**
	 * Throws an appropriate error if the result is a failure.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing or invalid.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaNotFoundError} If a resource does not exist.
	 * @throws AulaRestError A general error for unexpected or uncategorized REST
	 *                       failures when none of the more specific errors apply.
	 */
	public ensureSuccess()
	{
		if (this.#_succeeded)
			return;

		switch (this.#_statusCode)
		{
			case HttpStatusCode.Unauthorized:
				throw new AulaUnauthorizedError(this.#_problemDetails ?? undefined);
			case HttpStatusCode.Forbidden:
				throw new AulaForbiddenError(this.#_problemDetails ?? undefined);
			case HttpStatusCode.BadRequest:
				throw new AulaBadRequestError(this.#_problemDetails ?? undefined);
			case HttpStatusCode.NotFound:
				throw new AulaNotFoundError(this.#_problemDetails ?? undefined);
			default:
				throw new AulaRestError("The operation was unsuccessful.", this.#_problemDetails ?? undefined);
		}
	}
}

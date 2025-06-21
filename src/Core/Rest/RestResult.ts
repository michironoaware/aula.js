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
export class RestResult<TResult extends {} | null>
{
	readonly #_succeeded: boolean;
	readonly #_statusCode: HttpStatusCode;
	readonly #_value: TResult | null;
	readonly #_problemDetails: ProblemDetails | null;

	/**
	 * @package
	 * */
	public constructor(succeeded: true, result: TResult, status: HttpStatusCode);

	/**
	 * @package
	 * */
	public constructor(succeeded: false, problemDetails: ProblemDetails | null, status: HttpStatusCode);

	/**
	 * @package
	 * */
	constructor(succeeded: boolean, arg1: TResult | ProblemDetails | null, status: HttpStatusCode)
	{
		SealedClassError.throwIfNotEqual(RestResult, new.target);
		ThrowHelper.TypeError.throwIfNotType(succeeded, "boolean");
		ThrowHelper.TypeError.throwIfNotType(status, "number");
		ThrowHelper.TypeError.throwIfUndefined(arg1);

		this.#_succeeded = succeeded;
		this.#_statusCode = status;
		if (succeeded)
		{
			ThrowHelper.TypeError.throwIfType(arg1, ProblemDetails);
			this.#_value = arg1;
			this.#_problemDetails = null;
		} else
		{
			ThrowHelper.TypeError.throwIfNotAnyType(arg1, ProblemDetails, "null");
			this.#_value = null;
			this.#_problemDetails = arg1;
		}
	}

	/**
	 * Gets whether the operation was successful
	 * */
	public get succeeded()
	{
		return this.#_succeeded;
	}

	/**
	 * Gets the HTTP status code of the response associated with the result.
	 * */
	public get statusCode()
	{
		return this.#_statusCode;
	}

	/**
	 * Gets the problem details associated with a failed result.
	 * Returns `null` if the result was successful.
	 * */
	public get problemDetails()
	{
		return this.#_problemDetails;
	}

	/**
	 * Gets the value of a successful result, or defaults to `null` if the result was unsuccessful.
	 * */
	public get value()
	{
		return this.#_value;
	}

	/**
	 * Throws an appropriate error if the result is a failure.
	 * @throws {AulaUnauthorizedError} If the provided authorization credentials are missing or invalid.
	 * @throws {AulaForbiddenError} If the user is not authorized to perform this action.
	 * @throws {AulaBadRequestError} If the request was improperly formatted, or the server couldn't understand it.
	 * @throws {AulaNotFoundError} If the resource does not exist.
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

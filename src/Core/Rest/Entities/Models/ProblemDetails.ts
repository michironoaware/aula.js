import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { HttpStatusCode } from "../../../../Common/Http/HttpStatusCode.js";
import { TypeHelper } from "../../../../Common/TypeHelper.js";
import { ReadonlyDictionary } from "../../../../Common/Collections/ReadonlyDictionary.js";

/**
 * Represents a standardized structure for problem details returned by an API.
 * This (partially) aligns with {@link https://www.rfc-editor.org/rfc/rfc9457 RFC 9457}.
 */
export class ProblemDetails
{
	readonly #_title: string;
	readonly #_detail: string;
	readonly #_status: HttpStatusCode;
	readonly #_errors: Map<string, string[]> | null = null;
	#_errorsView: ReadonlyDictionary<string, string[]> | null = null;

	/**
	 * Initializes a new instance of {@link ProblemDetails}.
	 * @param data An object that conforms to the problem details JSON schema
	 *             from where the data will be extracted.
	 * */
	public constructor(data: any)
	{
		ThrowHelper.TypeError.throwIfNullable(data);
		ThrowHelper.TypeError.throwIfNotType(data.title, "string");
		ThrowHelper.TypeError.throwIfNotType(data.detail, "string");
		ThrowHelper.TypeError.throwIfNotType(data.status, "number");
		ThrowHelper.TypeError.throwIfNotAnyType(data.errors, "object", "nullable");

		this.#_title = data.title;
		this.#_detail = data.detail;
		this.#_status = data.status;

		if (!TypeHelper.isNullable(data.errors))
		{
			this.#_errors = new Map<string, string[]>();

			for (const propertyName in data.errors)
			{
				const propertyErrors = data.errors[propertyName];
				if (!TypeHelper.isTypeArray(propertyErrors, "string"))
				{
					continue;
				}

				this.#_errors.set(propertyName, propertyErrors);
			}
		}
	}

	/**
	 * Gets the short, human-readable summary of the problem type.
	 * */
	public get title()
	{
		return this.#_title;
	}

	/**
	 * Gets the human-readable explanation specific to this occurrence of the problem.
	 * */
	public get detail()
	{
		return this.#_detail;
	}

	/**
	 * Gets the HTTP status code.
	 * */
	public get status()
	{
		return this.#_status;
	}

	/**
	 * Gets the validation errors.
	 * */
	public get errors()
	{
		return this.#_errorsView ??= this.#_errors != null ? new ReadonlyDictionary(this.#_errors) : ReadonlyDictionary.empty;
	}
}

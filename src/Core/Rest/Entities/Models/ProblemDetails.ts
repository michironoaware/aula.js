import { ThrowHelper } from "../../../../Common/ThrowHelper.js";
import { HttpStatusCode } from "../../../../Common/Http/HttpStatusCode.js";
import { TypeHelper } from "../../../../Common/TypeHelper.js";
import { ReadonlyMapWrapper } from "../../../../Common/Collections/ReadonlyMapWrapper.js";

export class ProblemDetails
{
	readonly #_title: string;
	readonly #_detail: string;
	readonly #_status: HttpStatusCode;
	readonly #_errors: Map<string, string[]> | null = null;
	#_errorsView: ReadonlyMapWrapper<string, string[]> | null = null;

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
	
	public get title()
	{
		return this.#_title;
	}
	
	public get detail()
	{
		return this.#_detail;
	}
	
	public get status()
	{
		return this.#_status;
	}
	
	public get errors()
	{
		return this.#_errorsView ??= this.#_errors != null ? new ReadonlyMapWrapper(this.#_errors) : ReadonlyMapWrapper.empty;
	}
}

import { MultipartContent } from "./MultipartContent.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { HttpContent } from "./HttpContent.js";
import { SealedClassError } from "../SealedClassError.js";

export class MultipartFormDataContent extends MultipartContent
{
	public constructor(boundary?: string)
	{
		super("form-data", boundary);
		SealedClassError.throwIfNotEqual(MultipartFormDataContent, new.target);
	}

	public add(content: HttpContent, name?: string, filename?: string)
	{
		ThrowHelper.TypeError.throwIfNotType(content, HttpContent);
		ThrowHelper.TypeError.throwIfNotAnyType(name, "string", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(filename, "string", "undefined");

		content.headers.add("content-disposition", "form-data");

		if (name !== undefined)
		{
			content.headers.append("content-disposition", `name="${name}"`);
		}

		if (filename !== undefined)
		{
			content.headers.append("content-disposition", `filename="${filename}"`);
		}

		super.add(content);
	}
}

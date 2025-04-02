import { MultipartContent } from "./MultipartContent.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { HttpContent } from "./HttpContent.js";

export class MultipartFormDataContent extends MultipartContent
{
	public constructor(boundary?: string)
	{
		super("form-data", boundary);
	}

	public add(content: HttpContent, name?: string, filename?: string)
	{
		ThrowHelper.TypeError.throwIfNotType(content, HttpContent);
		ThrowHelper.TypeError.throwIfNotAnyType(name, "string", "undefined");
		ThrowHelper.TypeError.throwIfNotAnyType(filename, "string", "undefined");

		content.headers.add("Content-Disposition",
			`form-data`
			+ (name ? `; name="${name}"` : "")
			+ (filename ? `; filename="${filename}"` : ""));
		super.add(content);
	}
}

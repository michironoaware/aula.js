import { MultipartContent } from "./MultipartContent";
import { ThrowHelper } from "../ThrowHelper";
import { HttpContent } from "./HttpContent";
import { SealedClassError } from "../SealedClassError";

/**
 * Provides a container for content encoded using multipart/form-data MIME type.
 * @sealed
 * @remarks This type is derived from {@link MultipartContent} type.
 *          All {@link MultipartFormDataContent} does is provide methods to add
 *          required Content-Disposition headers to content object added to the collection.
 * */
export class MultipartFormDataContent extends MultipartContent
{
	/**
	 * Initializes a new instance of {@link MultipartFormDataContent}.
	 * */
	public constructor(boundary?: string)
	{
		super("form-data", boundary);
		SealedClassError.throwIfNotEqual(MultipartFormDataContent, new.target);
	}

	/**
	 * Add HTTP content to a collection of {@link HttpContent} objects that get serialized to multipart/form-data MIME type.
	 * @param content The HTTP content to add to the collection.
	 * @param name The name for the HTTP content to add.
	 * @param filename The file name for the HTTP content to add to the collection.
	 * @throws {ObjectDisposedError} If the instance has been disposed.
	 * */
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

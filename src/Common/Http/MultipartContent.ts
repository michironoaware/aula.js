import { HttpContent } from "./HttpContent.js";
import { ThrowHelper } from "../ThrowHelper.js";
import { HeaderMap } from "./HeaderMap.js";
import { ObjectDisposedError } from "../ObjectDisposedError.js";

export class MultipartContent extends HttpContent
{
	static #s_allowedBoundaryChars: string = "()+,-./0123456789:=?ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
	static #s_boundaryPrefix = "--";
	static #s_boundaryMaxLength: number = 70;
	static #s_crlf: string = "\r\n";
	static #s_textEncoder: TextEncoder = new TextEncoder();

	readonly #_boundary: string;
	readonly #_contents: HttpContent[] = [];
	readonly #_headers: HeaderMap = new HeaderMap();
	#_disposed: boolean = false;

	public constructor(subType: string = "mixed", boundary?: string)
	{
		super();
		ThrowHelper.TypeError.throwIfNotType(subType, "string");
		ThrowHelper.TypeError.throwIfNotAnyType(boundary, "string", "undefined");

		boundary = boundary ? boundary : MultipartContent.#generateBoundary();
		MultipartContent.#throwIfInvalidBoundary(boundary);

		this.#_headers.add("content-type", "multipart/form-data");
		this.#_headers.append("content-type", `boundary="${boundary}"`);
		this.#_boundary = boundary;
	}

	public get headers()
	{
		return this.#_headers;
	}

	static #throwIfInvalidBoundary(boundary: string)
	{
		if (boundary.length > this.#s_boundaryMaxLength)
		{
			throw new TypeError(`Boundary length must be at most ${this.#s_boundaryMaxLength}.`);
		}

		if (boundary.endsWith(" "))
		{
			throw new TypeError("Boundary cannot end with an space character.");
		}

		for (const char of boundary)
		{
			if (!this.#s_allowedBoundaryChars.includes(char))
			{
				throw new TypeError("Boundary contains an invalid character.");
			}
		}
	}

	static #generateBoundary()
	{
		const randomBytes = new Uint8Array(16);
		crypto.getRandomValues(randomBytes);
		return Array.from(randomBytes, b => this.#s_allowedBoundaryChars[b % this.#s_allowedBoundaryChars.length]).join("");
	}

	public add(content: HttpContent)
	{
		ThrowHelper.TypeError.throwIfNotType(content, HttpContent);
		ObjectDisposedError.throwIf(this.#_disposed);
		this.#_contents.push(content);
	}

	public async readAsStream()
	{
		ObjectDisposedError.throwIf(this.#_disposed);

		if (this.#_contents.length == 0)
		{
			return new Blob().stream();
		}

		const contents: { headers: HeaderMap, bodyBytes: Promise<Uint8Array> }[] =
			this.#_contents.map(c =>
			{
				return { headers: c.headers, bodyBytes: c.readAsByteArray() };
			});
		await Promise.all(contents.map(c => c.bodyBytes));

		const boundary = MultipartContent.#s_boundaryPrefix + this.#_boundary;
		const parts: (string | Uint8Array)[] = [ boundary, MultipartContent.#s_crlf ];
		for (const content of contents)
		{
			const headerFields = Array.from(content.headers).map(h =>
			{
				const headerName = h[0];
				const headerValues = h[1].join("; ");
				return `${headerName}: ${headerValues}${MultipartContent.#s_crlf}`;
			});

			parts.push(...headerFields);
			parts.push(MultipartContent.#s_crlf);
			parts.push(await content.bodyBytes);
			parts.push(MultipartContent.#s_crlf);
			parts.push(boundary);
		}

		return new Blob(parts).stream();
	}

	public dispose()
	{
		if (this.#_disposed)
		{
			return;
		}

		for (const content of this.#_contents)
		{
			content.dispose();
		}

		this.#_disposed = true;
	}
}

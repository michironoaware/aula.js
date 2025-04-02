export namespace StringHelper
{
	const whitespaceChars = " \t\n\r\v\f";

	export function isWhiteSpace(str: string)
	{
		return str.length === 0 || Array.from(str).every(c => whitespaceChars.includes(c));
	}
}

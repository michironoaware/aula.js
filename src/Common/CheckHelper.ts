export namespace CheckHelper
{
	export function isType(object: unknown, type: any): boolean
	{
		const isTypeOf = typeof type === "string" && typeof object === type;
		const isInstanceOf = typeof type !== "string" && object instanceof type;
		return isTypeOf || isInstanceOf;
	}
}

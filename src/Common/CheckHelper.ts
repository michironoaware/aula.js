export namespace CheckHelper
{
	export function isType<T>(object: T, type: any): boolean
	{
		const isTypeOf = typeof type === "string" && typeof object === type;
		const isInstanceOf = typeof type !== "string" && object instanceof type;
		return isTypeOf || isInstanceOf;
	}
}

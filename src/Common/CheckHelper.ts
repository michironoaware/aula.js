export namespace CheckHelper
{
	export function isType(object: unknown, type: any): boolean
	{
		const isTypeOf = typeof type === "string" && typeof object === type;
		const isInstanceOf = typeof type !== "string" && typeof type !== "object" && object instanceof type;
		// For checking whether an enum value is inside the defined range
		const isPropertyOf = typeof type === "object" && type[object as any];

		return isTypeOf || isInstanceOf || isPropertyOf;
	}
}

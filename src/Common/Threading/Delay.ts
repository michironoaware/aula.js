import { ThrowHelper } from "../ThrowHelper.js";

export async function Delay(milliseconds: number)
{
	ThrowHelper.TypeError.throwIfNotType(milliseconds, "number");
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

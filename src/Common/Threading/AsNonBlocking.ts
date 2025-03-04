import { Func } from "../Func.js";
import { ThrowHelper } from "../ThrowHelper.js";

export async function AsNonBlocking<TFunc extends Func<[], TReturn>, TReturn>(func: TFunc): Promise<TReturn>
{
	ThrowHelper.TypeError.throwIfNotType(func, "function");

	return new Promise((resolve, reject) =>
	{
		setTimeout(() =>
		{
			try
			{
				resolve(func());
			}
			catch (error)
			{
				reject(error);
			}
		}, 0);
	});
}

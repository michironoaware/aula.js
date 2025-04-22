import { Func } from "../Func";
import { ThrowHelper } from "../ThrowHelper";

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

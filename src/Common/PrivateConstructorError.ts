import { ThrowHelper } from "./ThrowHelper.js";

/**
 * Thrown when a private constructor is called outside its class.
 * */
export class PrivateConstructorError extends Error
{
	/**
	 * Initializes a new instance of {@link PrivateConstructorError}.
	 * */
	public constructor()
	{
		super("Cannot call a private constructor from outside the class.");
	}

	/**
	 * Throws if the {@link providedKey} is not equal to the {@link constructorKey}.
	 * @param constructorKey A secret symbol that only the class has access to.
	 * @param providedKey The symbol to compare against the {@link constructorKey}.
	 * */
	public static throwIfNotEqual(constructorKey: symbol, providedKey: symbol)
	{
		ThrowHelper.TypeError.throwIfNotType(constructorKey, "symbol");
		ThrowHelper.TypeError.throwIfNotType(providedKey, "symbol");

		if (constructorKey !== providedKey)
		{
			throw new PrivateConstructorError();
		}
	}
}

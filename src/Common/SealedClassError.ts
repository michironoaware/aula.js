/**
 * Thrown when a class that inherits from another sealed class is instantiated.
 * @remarks This error should not be caught; instead, the code should be
 *          refactored to prevent the error from occurring in the first place.
 * @sealed
 * */
export class SealedClassError extends Error
{
	/**
	 * Initializes a new instance of {@link SealedClassError}.
	 * */
	public constructor()
	{
		super("This class extends a sealed class and cannot be instantiated");
		SealedClassError.throwIfNotEqual(SealedClassError, new.target);
	}

	/**
	 * Throws a {@link SealedClassError} if both classes don't match.
	 * @param type The original, sealed class.
	 * @param target The class of the object being instantiated.
	 * */
	public static throwIfNotEqual(type: Function, target: Function)
	{
		if (target !== type)
		{
			throw new SealedClassError();
		}
	}
}

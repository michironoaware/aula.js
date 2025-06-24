/**
 * Enumerates the type of problem that can occur when doing a rest operation.
 * */
export const RestProblemType =
	{
		/**
		 * Occurs for unexpected or uncategorized REST failures when none of the more specific errors apply.
		 * */
		Unknown: 0,

		/**
		 * Occurs when a specified resource could not be found.
		 * This may happen either because the resource itself does not exist,
		 * or because a referenced resource within the request is missing or invalid.
		 * */
		NotFound: 1,

		/**
		 * Occurs when the request was improperly formatted, or the server couldn't understand it.
		 * */
		BadRequest: 2,

		/**
		 * Occurs when the user is not authorized to perform this action.
		 * */
		Forbidden: 3,

		/**
		 * Occurs when the provided authorization credentials are missing or invalid.
		 * */
		Unauthorized: 4,
	} as const;

Object.freeze(RestProblemType);

export type RestProblemType = typeof RestProblemType[keyof typeof RestProblemType] | number;

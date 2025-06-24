/**
 * Enumerates the type of results for a REST operation.
 * */
export const RestResultType =
	{
		/**
		 * A REST operation that completed successfully.
		 * */
		Success: 0,

		/**
		 * Occurs for unexpected or uncategorized REST failures when none of the more specific errors apply.
		 * */
		UnknownProblem: 1,

		/**
		 * Occurs when a specified resource could not be found.
		 * This may happen either because the resource itself does not exist,
		 * or because a referenced resource within the request is missing or invalid.
		 * */
		NotFound: 2,

		/**
		 * Occurs when the request was improperly formatted, or the server couldn't understand it.
		 * */
		BadRequest: 3,

		/**
		 * Occurs when the user is not authorized to perform this action.
		 * */
		Forbidden: 4,

		/**
		 * Occurs when the provided authorization credentials are missing or invalid.
		 * */
		Unauthorized: 5,
	} as const;

Object.freeze(RestResultType);

export type RestResultType = typeof RestResultType[keyof typeof RestResultType] | number;
